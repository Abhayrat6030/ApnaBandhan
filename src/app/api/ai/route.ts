
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key is not configured." }, { status: 500 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: "You are a helpful wedding planning assistant for a company called ApnaBandhan. Your goal is to help users with ideas for wedding invitations, save the date messages, and other wedding-related content. Be friendly, creative, and polite. If the user asks in Hindi, you must respond in Hindi."
            },
            { 
                role: "user",
                content: message 
            }
        ],
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Groq API Error:", errorData);
        return NextResponse.json({ error: "Failed to fetch response from Groq API." }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content ?? "",
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
