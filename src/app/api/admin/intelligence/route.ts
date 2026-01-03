
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { initializeAdminApp } from '@/firebase/admin';
import * as tools from './tools';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

const availableTools = {
  listNewUsers: tools.listNewUsers,
  listRecentOrders: tools.listRecentOrders,
};

async function getGroqChatCompletion(messages: any[], toolConfig?: any) {
  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.1,
    max_tokens: 4096,
    ...toolConfig
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Groq API Error:", errorBody);
    throw new Error(errorBody.error?.message || `Groq API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
    try {
        const adminApp = initializeAdminApp();
        if (!adminApp) {
            return NextResponse.json({ error: "Firebase Admin not initialized. Check server credentials." }, { status: 503 });
        }
        
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }
        const decodedClaims = await adminApp.auth().verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission for this action." }, { status: 403 });
        }
    } catch (error: any) {
        console.error("Admin auth verification error:", error);
        return NextResponse.json({ error: "Unauthorized: Invalid session." }, { status: 401 });
    }
    
    const { message, history } = await req.json();

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".
    Your role is to provide the website administrator with clear, concise, and professional data-driven insights by using the tools you have been given.

    Key Instructions:
    1.  **Use Your Tools**: You have access to tools that can fetch live data about users and orders from the database. Use them whenever a user asks a question that requires specific data.
    2.  **Interpret Data**: When a tool returns data (like a list of users or orders), do not just dump the raw JSON. Instead, interpret and present the information in a clear, human-readable format. For example, "You have 3 new users today: John Doe (john@example.com), Jane Smith (jane@example.com)..."
    3.  **Be Proactive**: If a user asks a general question like "How's business?", use your available tools (like \`listNewUsers\` and \`listRecentOrders\`) to provide a specific, data-backed answer for the day.
    4.  **Handle "Not Found"**: If a tool returns no data (e.g., no new users today), state that clearly and positively. For example, "There are no new users to report for today."
    5.  **General Knowledge**: If the question is not about specific app data (e.g., "give me marketing ideas"), you can answer from your general knowledge.
    6.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful.`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...(history || []),
        { role: 'user', content: message }
    ];

    const toolDefinitions = Object.values(availableTools).map(t => t.definition);

    try {
        const firstResponse = await getGroqChatCompletion(messages, {
            tools: toolDefinitions,
            tool_choice: "auto",
        });

        const responseMessage = firstResponse.choices[0].message;

        if (responseMessage.tool_calls) {
            messages.push(responseMessage); // Add assistant's decision to call a tool

            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name as keyof typeof availableTools;
                const functionToCall = availableTools[functionName]?.execute;
                
                if (functionToCall) {
                    try {
                        const functionArgs = JSON.parse(toolCall.function.arguments);
                        const functionResponse = await functionToCall(functionArgs);
                        messages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: functionName,
                            content: JSON.stringify(functionResponse),
                        });
                    } catch (error: any) {
                        console.error(`Error executing tool ${functionName}:`, error);
                        messages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: functionName,
                            content: JSON.stringify({ error: `Error executing tool: ${error.message}` }),
                        });
                    }
                }
            }

            const secondResponse = await getGroqChatCompletion(messages);
            const finalReply = secondResponse.choices[0].message.content;
            return NextResponse.json({ reply: finalReply });

        } else {
            // No tool was called, just return the direct reply
            const reply = responseMessage.content;
            return NextResponse.json({ reply });
        }

    } catch (error: any) {
        console.error("Admin Assistant API Error:", error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
