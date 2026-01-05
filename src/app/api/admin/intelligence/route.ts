
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";
import Groq from "groq-sdk";
import { listNewUsers, listRecentOrders, getAppStatus } from "./tools";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

const tools = [
  {
    type: 'function',
    function: {
      name: 'listNewUsers',
      description: 'Get a list of the most recent users who have signed up.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'The number of users to fetch.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listRecentOrders',
      description: 'Get a list of the most recent orders placed.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'The number of orders to fetch.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getAppStatus',
      description: 'Get the general status of the app, like total user and order counts.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

export async function POST(req: NextRequest) {
    try {
        // --- Authentication ---
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }

        const admin = initializeAdminApp();
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission." }, { status: 403 });
        }

        const { message, history } = await req.json();
        if (!message) {
             return NextResponse.json({ error: "Message is required." }, { status: 400 });
        }
        
        const messages = [
            { role: "system", content: `You are AdminAI, a helpful admin assistant for ApnaBandhan. Use the available tools to answer user questions about orders, users, and general app status. Be concise.` },
            ...(history || []),
            { role: "user", content: message },
        ];
        
        // --- Call Groq with Tools ---
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: messages as any,
            tools: tools as any,
            tool_choice: "auto",
        });

        const responseMessage = response.choices[0]?.message;

        // --- Handle Tool Calls ---
        const toolCalls = responseMessage?.tool_calls;
        if (toolCalls) {
            const availableFunctions: { [key: string]: Function } = {
                listNewUsers: listNewUsers,
                listRecentOrders: listRecentOrders,
                getAppStatus: getAppStatus,
            };
            
            messages.push(responseMessage); 

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall(functionArgs);
                
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: JSON.stringify(functionResponse),
                } as any);
            }
            
            const secondResponse = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: messages as any,
            });

            return NextResponse.json({ reply: secondResponse.choices[0]?.message?.content });
        }
        
        // --- Regular Response ---
        const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Admin Intelligence Error:", error);
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}
