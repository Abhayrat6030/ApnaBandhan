
import { NextResponse } from "next/server";
import { generateInvitationText, type GenerateInvitationTextInput } from "@/ai/flows/generate-invitation-text";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const input: GenerateInvitationTextInput = {
      prompt: message,
      history: history || [],
    };
    
    const result = await generateInvitationText(input);

    return NextResponse.json({
      reply: result.response,
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
  }
}
