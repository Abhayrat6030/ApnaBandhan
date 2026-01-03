
'use server';

import { genkit, ai } from 'genkit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {googleAI} from '@genkit-ai/google-genai';
import { siteConfig } from '@/lib/constants';
import { initializeAdminApp } from '@/firebase/admin';

// Initialize Firebase Admin for server-side operations
const admin = initializeAdminApp();
let db;
if (admin) {
  db = admin.firestore();
}

genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const listServices = async () => {
    if (!db) throw new Error("Firestore is not initialized.");
    const servicesCollection = collection(db, 'services');
    const packagesCollection = collection(db, 'comboPackages');
    const servicesSnapshot = await getDocs(servicesCollection);
    const packagesSnapshot = await getDocs(packagesCollection);
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const packages = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { services, packages };
};

const listCoupons = async () => {
    if (!db) throw new Error("Firestore is not initialized.");
    const couponsCollection = collection(db, 'coupons');
    const q = query(couponsCollection, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const coupons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { coupons };
};

const assistant = ai.definePrompt(
    {
      name: 'assistant-prompt',
      input: {
        schema: z.object({
          message: z.string(),
        }),
      },
      tools: [
        ai.defineTool(
          {
            name: 'listServices',
            description: 'Get a list of all available services and combo packages offered by the company.',
            inputSchema: z.any(),
            outputSchema: z.object({
              services: z.array(z.any()),
              packages: z.array(z.any()),
            }),
          },
          listServices
        ),
        ai.defineTool(
          {
            name: 'listCoupons',
            description: 'Get a list of all currently active discount coupons.',
            inputSchema: z.any(),
            outputSchema: z.object({
              coupons: z.array(z.any()),
            }),
          },
          listCoupons
        ),
      ],
      system: `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content.

You can also answer questions about the company's services, pricing, and general information.
- The company's contact phone number is ${siteConfig.phone}.
- The company's contact email is ${siteConfig.email}.

Key Instructions:
1.  **Tool Usage**: You have tools to get real-time information about services and active coupons. Use them whenever a user asks about pricing, packages, or discounts. For example, if a user asks "what are your prices?" or "do you have any offers?", use your tools to provide accurate, up-to-date information from the database.
2.  **Be Creative & Evocative**: For content requests, use rich, descriptive, and emotional language. Include short poems, quotes, or culturally relevant phrases where appropriate.
3.  **Cultural Sensitivity**: Be mindful of Indian cultural nuances and traditions.
4.  **Structured Responses**: Format your answers clearly. Use headings, bullet points, and short paragraphs to make the content easy to read and copy.
5.  **Language**: If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
6.  **Maintain Persona**: Always act as Bandhan, the helpful assistant from ApnaBandhan. Do not reveal you are an AI model.
7.  **Concise and Helpful**: Keep your answers helpful and to the point. Avoid overly long responses. When listing items like services or coupons, summarize them nicely.
`,
    }
  );


export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const response = await ai.generate({
        prompt: message,
        model: googleAI.model('gemini-1.5-flash-latest'),
        history: history,
        tools: assistant.tools,
        system: assistant.system,
    });
    
    return NextResponse.json({ reply: response.text() });

  } catch(e: any) {
    console.error("AI API Error:", e);
    return NextResponse.json({ error: e.message || "An unexpected error occurred." }, { status: 500});
  }
}
