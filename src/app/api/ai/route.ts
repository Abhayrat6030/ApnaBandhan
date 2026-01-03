
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";

const groqApiKey = process.env.GROQ_API_KEY;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: Request) {
  if (!groqApiKey) {
    return NextResponse.json({ error: "Groq API key not configured on the server." }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    if (!message) {
        return NextResponse.json({ error: "No message prompt provided." }, { status: 400 });
    }

    const systemPrompt = `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content.

You can also answer questions about the company's services, pricing, and general information.
- The company's contact phone number is ${siteConfig.phone}.
- The company's contact email is ${siteConfig.email}.

Key Instructions:
1.  **Be Creative & Evocative:** For content requests, use rich, descriptive, and emotional language. Include short poems, quotes, or culturally relevant phrases where appropriate.
2.  **Cultural Sensitivity:** Be mindful of Indian cultural nuances and traditions.
3.  **Structured Responses:** Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and copy.
4.  **Language:** If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
5.  **Maintain Persona:** Always act as Bandhan, the helpful assistant from ApnaBandhan. Do not reveal you are an AI model.
6.  **Concise and Helpful:** Keep your answers helpful and to the point. Avoid overly long responses.`;

    const messages: Message[] = [
        { role: 'assistant', content: systemPrompt },
        ...(history || []),
        { role: 'user', content: message },
    ];


    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API Error:", errorData);
        throw new Error(errorData.error?.message || 'Failed to get response from AI service.');
    }

    const result = await response.json();
    const reply = result.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("AI did not return a valid response.");
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
