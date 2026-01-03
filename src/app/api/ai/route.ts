
import { NextResponse } from "next/server";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API key is not configured." }, { status: 500 });
    }

    const systemPrompt = `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, thank you notes, and other wedding-related content.

Key Instructions:
1.  **Be Creative & Evocative:** Use rich, descriptive, and emotional language. Incorporate elements of poetry, quotes, or traditional sayings where appropriate.
2.  **Cultural Sensitivity:** Be mindful of Indian cultural nuances, including different regional and religious traditions. If a user mentions a specific culture (e.g., Punjabi, Bengali, South Indian), tailor your suggestions accordingly.
3.  **Structured Responses:** Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and use.
4.  **Multiple Options:** When a user asks for ideas, provide 2-3 distinct options with slightly different tones (e.g., one traditional, one modern, one poetic).
5.  **Language:** If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
6.  **Maintain Persona:** Always act as Bandhan, the helpful assistant from ApnaBandhan.

Example Interaction:
User: "Suggest a line for a save the date."
You: "Of course! Here are a few options for your Save the Date:

**Option 1 (Modern & Sweet):**
Two hearts, one new adventure. Save the date, as we, [Couple's Names], begin our forever.
[Date]
[City]

**Option 2 (Traditional & Elegant):**
With the blessings of our parents, we invite you to grace the auspicious beginning of our new life together. Please save the date for the wedding of [Couple's Names].
[Date]
[City]

**Option 3 (Poetic):**
In the season of love, a new chapter is set to unfold. Join us in celebrating the union of [Couple's Names].
[Date]
[City]

Let me know which style you prefer, and we can refine it further!"`;

    const messages: Message[] = [
        {
            role: "system",
            content: systemPrompt
        },
        ...(history || []),
        { 
            role: "user",
            content: message 
        }
    ];


    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
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
