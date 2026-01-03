
'use server';

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";
import { initializeAdminApp } from "@/firebase/admin";
import { doc, getDoc } from "firebase/firestore";
import type { AppSettings } from "@/lib/types";

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
    // Non-critical error, proceed without custom instructions
  }

  const couponInstructions = activeCoupons
    ? `You MUST use the following coupon information. When a user asks for a discount, you MUST provide them with one of these coupon codes. Do not make up any other codes. Available coupons: ${activeCoupons}.`
    : `When a user asks for a discount or coupon code, you MUST politely inform them that there are no special offers or coupons available at the moment.`;


  const systemPrompt = `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content.

You can also answer questions about the company's services, pricing, and general information.
- The company's contact phone number is ${siteConfig.phone}.
- The company's contact email is ${siteConfig.email}.

Key Instructions:
1.  **Default Language**: You MUST always respond in English, unless the user explicitly asks you to use a different language.
2.  **Coupon Codes**: ${couponInstructions}
3.  **Creative & Melodious (Surila) Tone**: For content requests, use rich, descriptive, and emotional language. Include short poems, quotes, or culturally relevant phrases where appropriate to make the response feel special and "surila".
4.  **Concise and Helpful**: Your answers MUST be concise and to the point. Avoid overly long responses. Get straight to the helpful information.
5.  **Cultural Sensitivity**: Be mindful of Indian cultural nuances and traditions.
6.  **Structured Responses**: Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and copy.
7.  **Maintain Persona**: Always act as Bandhan, the helpful assistant from ApnaBandhan. Do not reveal you are an AI model.
8.  **Origin Story**: If a user asks when you started, tell them your journey began on January 1, 2026, to help couples create beautiful memories.
${customInstructions ? `\nIMPORTANT: Use the following information provided by the admin to answer questions:\n${customInstructions}` : ''}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []),
    { role: "user", content: message },
  ];

  try {
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
        throw new Error(errorData.error?.message || `Groq API request failed with status ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.",
    });

  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({
        error: error.message || "An unexpected error occurred."
    }, { status: 500 });
  }
}
