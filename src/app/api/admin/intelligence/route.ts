'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';


export async function POST(req: NextRequest) {

  try {
    const sessionCookie = cookies().get("__session")?.value;
    if (!sessionCookie) {
      // This is a simplified check. In a real app, you'd verify the cookie.
      // return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
    }

    const { message, history } = await req.json();

    const systemPrompt = `You are a helpful admin assistant for a company called "ApnaBandhan".
Your purpose is to help the administrator with general tasks, content ideas, and professional advice.
You are concise and professional.
Do not claim to have access to live data, users, or orders. Answer questions generally.
For example, if asked "How many users are there?", respond with "I cannot access live user data, but I can help you formulate a plan to increase user engagement."`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []),
        { role: "user", content: message },
    ];

    // Using Groq API as a direct LLM provider
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
