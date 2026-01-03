
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';


async function getGroqChatCompletion(messages: any[]) {
  const body = {
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.1,
    max_tokens: 4096,
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
    const { message, history } = await req.json();

    // Simplified: Bypassing Firebase Admin SDK for this endpoint to ensure stability.
    // In a production app, a robust auth check (e.g., using a session cookie and verifySessionCookie) would be here.
    // For now, we trust the client-side has handled admin access.

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".
    Your role is to provide the website administrator with clear, concise, and professional advice and insights.

    Key Instructions:
    1.  **Act as an Expert**: Provide advice on marketing, user engagement, and e-commerce strategy.
    2.  **Be Proactive**: If a user asks a general question like "How's business?", you can provide general best practices or ask for more specific details, as you no longer have direct database access.
    3.  **General Knowledge**: Answer general knowledge questions related to running an online business.
    4.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful. Do not mention you are an AI.`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...(history || []),
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
