
'use server';

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";
import { initializeAdminApp } from "@/firebase/admin";
import { doc, getDoc } from "firebase/firestore";
import type { AppSettings } from "@/lib/types";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { message, history } = await req.json();

  let customInstructions = '';
  let activeCoupons = '';

  try {
    const admin = initializeAdminApp();
    if (admin) {
        const db = admin.firestore();
        const settingsDoc = await getDoc(doc(db, 'app-settings', 'ai-prompt'));
        if (settingsDoc.exists()) {
            const settings = settingsDoc.data() as AppSettings;
            customInstructions = settings.aiCustomInstructions || '';
            activeCoupons = settings.activeCoupons || '';
        }
    }
  } catch(error) {
    console.error("Error fetching AI custom instructions:", error);
  }

  const couponInstructions = activeCoupons
    ? `You MUST use the following coupon information. When a user asks for a discount, you MUST provide them with one of these coupon codes. Do not make up any other codes. Available coupons: ${activeCoupons}.`
    : `When a user asks for a discount or coupon code, you MUST politely inform them that there are no special offers or coupons available at the moment.`;


  const systemPrompt = `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations and other related content. You also answer questions about the company.

**Conversation Flow:**
1.  **Greeting & Name:** Start the conversation by warmly greeting the user and asking for their name.
2.  **Ask for Language:** Once you know their name, ask them which language they would prefer to speak in (e.g., English or Hindi).
3.  **Converse in Chosen Language:** For the rest of the conversation, you MUST respond in the language the user has chosen.

**Key Instructions:**
*   **Company Info:**
    *   The company's contact phone number is ${siteConfig.phone}.
    *   The company's contact email is ${siteConfig.email}.
*   **Coupon Codes:** ${couponInstructions}
*   **Tone:** For content requests, use a rich, descriptive, and "surila" (melodious) tone. Include short poems or quotes where appropriate.
*   **Conciseness:** Your answers MUST be concise and to the point.
*   **Persona:** Always act as Bandhan. Do not reveal you are an AI.
${customInstructions ? `\n*   **Admin Instructions:** Use the following information to answer questions: ${customInstructions}` : ''}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []),
    { role: "user", content: message },
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
        messages: messages as any,
        model: "llama3-70b-8192",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({
        error: error.message || "An unexpected error occurred."
    }, { status: 500 });
  }
}
