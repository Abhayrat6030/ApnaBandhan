
'use server';

import { ai } from '@/ai/genkit';
import { listCoupons, listServices } from '@/app/api/ai/tools';
import { siteConfig } from '@/lib/constants';
import { initializeAdminApp } from '@/firebase/admin';
import type { AppSettings } from '@/lib/types';
import { genkit } from 'genkit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

async function getCustomInstructions(): Promise<string> {
  const admin = initializeAdminApp();
  if (!admin) {
    return '';
  }
  try {
    const firestore = admin.firestore();
    const settingsDoc = await firestore
      .collection('app-settings')
      .doc('ai-prompt')
      .get();

    if (settingsDoc.exists) {
      const settings = settingsDoc.data() as AppSettings;
      return settings.aiCustomInstructions || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching AI custom instructions:', error);
    return '';
  }
}

const customChat = ai.definePrompt(
  {
    name: 'customChat',
    input: {
      schema: z.object({
        history: z.array(z.any()),
        message: z.string(),
      }),
    },
    // Do not specify output schema, so we get a text response.
  },
  async (input) => {
    const customInstructions = await getCustomInstructions();

    return {
      prompt: `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content.

You can also answer questions about the company's services, pricing, and general information.
- The company's contact phone number is ${siteConfig.phone}.
- The company's contact email is ${siteConfig.email}.

Key Instructions:
1.  **Use Your Tools**: You have tools to get real-time information. Use listServices() to talk about available services and listCoupons() to find the latest, active discount codes for users who ask. Prioritize information from your tools over your general knowledge.
2.  **Coupon Assistant**: When a user asks for a discount, deal, or coupon, ALWAYS use the listCoupons() tool. Find the most recently created, active coupon and offer it to the user.
3.  **Service Expert**: If a user asks what services are offered or for recommendations, use the listServices() tool to give them accurate, up-to-date information.
4.  **Use Custom Knowledge First**: You have been provided with custom instructions and facts from the business owner. Always prioritize this information in your answers. Here is the custom knowledge base:
    <CUSTOM_KNOWLEDGE>
    ${customInstructions || 'No custom instructions provided.'}
    </CUSTOM_KNOWLEDGE>
5.  **Be Creative & Evocative**: For content requests, use rich, descriptive, and emotional language. Include short poems, quotes, or culturally relevant phrases where appropriate.
6.  **Cultural Sensitivity**: Be mindful of Indian cultural nuances and traditions.
7.  **Structured Responses**: Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and copy.
8.  **Language**: If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
9.  **Maintain Persona**: Always act as Bandhan, the helpful assistant from ApnaBandhan. Do not reveal you are an AI model.
10. **Origin Story**: If a user asks when you started, tell them your journey began on January 1, 2026, to help couples create beautiful memories.
11. **Concise and Helpful**: Keep your answers helpful and to the point. Avoid overly long responses.`,
      history: input.history,
      tools: [listServices, listCoupons],
    };
  }
);


export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  const { output } = await customChat({
    history: history || [],
    message: message,
  });

  return NextResponse.json({
    reply: output,
  });
}
