import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { initializeAdminApp } from '@/firebase/admin';
import { listNewUsers, listRecentOrders, AppStatusTool } from './tools';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

const availableTools = {
  listNewUsers,
  listRecentOrders,
  AppStatusTool,
};

async function getGroqChatCompletion(messages: any[], tools: any[] = []) {
  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.2,
    max_tokens: 1024,
  };

  if (tools.length > 0) {
    // @ts-ignore
    body.tools = tools;
    // @ts-ignore
    body.tool_choice = "auto";
  }

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
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  return response.json();
}


export async function POST(req: NextRequest) {
    const admin = initializeAdminApp();
    if (!admin) {
        return NextResponse.json({ error: "Firebase Admin SDK is not initialized." }, { status: 503 });
    }

    try {
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie found." }, { status: 401 });
        }
        
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to access this." }, { status: 403 });
        }

    } catch (error: any) {
         return NextResponse.json({ error: `Authentication failed: ${error.message}` }, { status: 401 });
    }
    
    const { message, history } = await req.json();

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".

    Your role is to provide the website administrator with clear, concise, and accurate data-driven insights about the business. You have access to powerful tools that can query the live database for information about users and orders.
    
    Key Instructions:
    1.  **Be Factual and Data-Driven**: Your primary goal is to answer the admin's questions using the data provided by your tools. Do not make up information. If you don't know, say you don't have the data.
    2.  **Use Your Tools**: You MUST use your tools to answer questions about users, orders, or app status.
        - Use 'listNewUsers' when asked about user sign-ups, referral codes, or user details.
        - Use 'listRecentOrders' when asked about orders, sales, or customer purchase history.
        - Use 'AppStatusTool' when asked about general app status, like "today's status".
    3.  **Summarize Clearly**: When you get data from a tool, do not just dump the raw JSON. Summarize it in a clear, human-readable format. Use lists, bold text, and clear headings.
        - Example: Instead of \`{"name": "Rohan", "email": "r@ex.com"}\`, say: "**Rohan** (r@ex.com) signed up on..."
    4.  **Specify Timeframes**: When using tools, you can specify timeframes like 'today', 'this week', or 'this month'. Understand the user's intent (e.g., "new users" implies recent ones).
    5.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful.
    
    The admin will now ask you a question. Use your tools to provide the best possible answer.`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
    ];

    try {
        const toolDefinitions = Object.values(availableTools).map(tool => ({ type: 'function', function: tool.definition }));
        let response = await getGroqChatCompletion(messages, toolDefinitions);
        let responseMessage = response.choices[0].message;

        while (responseMessage.tool_calls) {
            messages.push(responseMessage);
            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name as keyof typeof availableTools;
                const tool = availableTools[functionName];

                if (!tool) {
                     messages.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        name: functionName,
                        content: JSON.stringify({ error: `Tool ${functionName} not found`}),
                    });
                    continue;
                }
                
                try {
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    const functionResponse = await tool.execute(functionArgs);
                    messages.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        name: functionName,
                        content: JSON.stringify(functionResponse),
                    });
                } catch (e: any) {
                     messages.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        name: functionName,
                        content: JSON.stringify({ error: `Error executing tool: ${e.message}`}),
                    });
                }
            }
            response = await getGroqChatCompletion(messages, toolDefinitions);
            responseMessage = response.choices[0].message;
        }

        return NextResponse.json({ reply: responseMessage.content });

    } catch (error: any) {
        console.error("Admin Assistant API Error:", error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
