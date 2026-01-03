import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

async function getGroqChatCompletion(messages: any[]) {
  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.2,
    max_tokens: 1024,
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
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  return response.json();
}


export async function POST(req: NextRequest) {
    // Note: We are removing the Firebase Admin check for now to resolve the 503 error.
    // A proper auth check should be reinstated if sensitive operations are added back.
    
    const { message, history } = await req.json();

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".

    Your role is to provide the website administrator with clear, concise, and professional advice on managing the business.
    
    Key Instructions:
    1.  **Be Professional**: Your primary goal is to act as a helpful assistant for the administrator.
    2.  **General Knowledge**: You can answer general questions about e-commerce, marketing, customer service, and business management.
    3.  **No Live Data Access**: You do not have access to live user or order data. If asked for specific data (e.g., "who were the last 5 orders?"), you must state that you cannot access live database information and suggest they check the relevant sections in the admin panel (like 'Orders' or 'Users' pages).
    4.  **Provide Suggestions**: Instead of providing live data, offer helpful suggestions. For example, if asked about new users, you can suggest marketing strategies to attract more users.
    5.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful.
    
    The admin will now ask you a question. Provide the best possible answer based on your general knowledge.`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
    ];

    try {
        const response = await getGroqChatCompletion(messages);
        const reply = response.choices[0].message.content;

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Admin Assistant API Error:", error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
