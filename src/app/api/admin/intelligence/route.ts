
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeAdminApp } from '@/firebase/admin';
import { listNewUsers, listRecentOrders, getAppStatus } from './tools';


const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      // return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
    }

    const { message, history } = await req.json();

    const systemPrompt = `You are a helpful admin assistant for "ApnaBandhan".
You can access some of the application's data by using the provided tools.
- listNewUsers: Get a list of the most recent users.
- listRecentOrders: Get a list of the most recent orders.
- getAppStatus: Get a summary of total users, orders, and revenue.
Based on the user's prompt, decide which tool(s) to use to answer the question.
If the user asks a general question, answer it in a helpful and professional manner.
Do not mention the tool names in your response, just give the answer.`;
    
    // This is a simplified tool-calling implementation without Genkit for stability.
    let toolResponse = '';

    if (message.toLowerCase().includes('new users')) {
        const users = await listNewUsers({});
        toolResponse = `Here are the latest users:\n${JSON.stringify(users, null, 2)}`;
    } else if (message.toLowerCase().includes('recent orders')) {
        const orders = await listRecentOrders({});
        toolResponse = `Here are the recent orders:\n${JSON.stringify(orders, null, 2)}`;
    } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('revenue') || message.toLowerCase().includes('total users')) {
        const status = await getAppStatus();
        toolResponse = `Here is the current app status:\n${JSON.stringify(status, null, 2)}`;
    }


    const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []),
        { role: "user", content: message },
    ];
    
    if (toolResponse) {
        messages.push({ role: 'assistant', content: toolResponse });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages }),
    });

    if (!groqResponse.ok) {
        const errorBody = await groqResponse.json();
        console.error("Groq API Error:", errorBody);
        throw new Error(errorBody.error?.message || "Groq API request failed");
    }
    
    const result = await groqResponse.json();
    const reply = result.choices[0]?.message?.content;

    return NextResponse.json({ reply: reply || "I'm sorry, I couldn't generate a response." });

  } catch (error: any) {
    console.error("Admin Intelligence Error:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
