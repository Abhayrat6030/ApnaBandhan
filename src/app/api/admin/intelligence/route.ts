'use server';

import { NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { listNewUsers, listRecentOrders, getAppStatus, createCoupon } from './tools';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

const availableTools = {
  listNewUsers,
  listRecentOrders,
  getAppStatus,
  createCoupon,
};

type Tool = keyof typeof availableTools;

async function runTool(tool: Tool, args: any) {
    if (availableTools[tool]) {
        return await availableTools[tool](args);
    }
    throw new Error(`Tool ${tool} not found.`);
}

export async function POST(req: NextRequest) {
  let admin;
  try {
    admin = initializeAdminApp();
  } catch (e: any) {
    return NextResponse.json({ error: "Server configuration error. Could not initialize admin services." }, { status: 503 });
  }

  try {
    const sessionCookie = cookies().get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    if (decodedClaims.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: You do not have permission for this action." }, { status: 403 });
    }

    const { message, history } = await req.json();

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for an e-commerce website called "ApnaBandhan".
Your purpose is to help the administrator get insights from the business data and perform actions by using the tools available to you.
You are concise and professional. When you use a tool and get data, present it in a clear, readable format (like a list or table).
Do not guess or make up information. If you cannot answer a question with the available tools, say so.

Available tools:
- \`listNewUsers(count: number)\`: Get a list of the most recent users.
- \`listRecentOrders(count:number)\`: Get a list of the most recent orders.
- \`getAppStatus()\`: Get a summary of key metrics (total users, new users, total orders, revenue).
- \`createCoupon(code: string, discountType: 'percentage' | 'fixed', discountValue: number, daysUntilExpiry: number)\`: Creates a new discount coupon.

Based on the user's request, decide if a tool is needed. If so, respond ONLY with the JSON for the tool call.
For example:
User: "show me the last 3 users"
Assistant: {"tool": "listNewUsers", "args": {"count": 3}}
User: "create a 10% off coupon called 'TENOFF' for 30 days"
Assistant: {"tool": "createCoupon", "args": {"code": "TENOFF", "discountType": "percentage", "discountValue": 10, "daysUntilExpiry": 30}}

If no tool is needed, answer the question directly.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []),
        { role: "user", content: message },
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages }),
    });

    if (!groqResponse.ok) throw new Error("Groq API request failed");
    const result = await groqResponse.json();
    let toolResponse = result.choices[0]?.message?.content;

    try {
        const toolCall = JSON.parse(toolResponse);
        if (toolCall.tool) {
            const toolResult = await runTool(toolCall.tool, toolCall.args);
            
            const finalMessages = [
                ...messages,
                { role: "assistant", content: toolResponse },
                { role: "system", content: `The tool returned the following data: ${JSON.stringify(toolResult)}. Use this data to formulate your final, user-friendly response.`}
            ];

            const finalGroqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: finalMessages }),
            });
            if (!finalGroqResponse.ok) throw new Error("Final Groq API request failed");

            const finalResult = await finalGroqResponse.json();
            return NextResponse.json({ reply: finalResult.choices[0]?.message?.content });
        }
    } catch (e) {
      // Not a tool call, just a regular response
    }

    return NextResponse.json({ reply: toolResponse || "I'm sorry, I couldn't generate a response." });

  } catch (error: any) {
    console.error("Admin Intelligence Error:", error);
    if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
        return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
