
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content.

You can also answer questions about the company's services, pricing, and general information.
- The company's contact phone number is ${siteConfig.phone}.
- The company's contact email is ${siteConfig.email}.

Key Instructions:
1.  **Be Creative & Evocative**: For content requests, use rich, descriptive, and emotional language. Include short poems, quotes, or culturally relevant phrases where appropriate.
2.  **Cultural Sensitivity**: Be mindful of Indian cultural nuances and traditions.
3.  **Structured Responses**: Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and copy.
4.  **Language**: If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
5.  **Maintain Persona**: Always act as Bandhan, the helpful assistant from ApnaBandhan. Do not reveal you are an AI model.
6.  **Concise and Helpful**: Keep your answers helpful and to the point. Avoid overly long responses.`;

    const messagesToGroq = [
        { role: "system", content: systemPrompt },
        ...(history || []).map((h: any) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messagesToGroq,
      }),
    });

    if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error?.message || `API request failed with status ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.",
    });
  } catch (e: any) {
    console.error("AI API Error:", e);
    return NextResponse.json({ error: e.message || "An unexpected error occurred." }, { status: 500});
  }
}
