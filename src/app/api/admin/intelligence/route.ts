
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import { ai, genkit } from '@/ai/genkit';
import * as tools from './tools';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
    let admin;
    try {
        admin = initializeAdminApp();
    } catch (e: any) {
        console.error("[Admin AI] Firebase Admin initialization failed:", e.message);
        return NextResponse.json({ error: "Server configuration error. Could not initialize admin services." }, { status: 503 });
    }

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (decodedToken.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission for this action.' }, { status: 403 });
        }
        
    } catch (error: any) {
        console.error("[Admin AI] Auth verification failed:", error);
        return NextResponse.json({ error: 'Unauthorized: Invalid or expired token.' }, { status: 401 });
    }
    
    // Auth is successful, proceed with AI logic
    const { message, history } = await req.json();

    const systemPrompt = `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".
    You have access to a set of tools to query the application's live database for information about users and orders.
    Your role is to provide the website administrator with clear, concise, and accurate data-driven answers.

    Key Instructions:
    1.  **Use Your Tools**: When the admin asks a question about data (e.g., "how many users," "show me orders," "what's the revenue?"), you MUST use the provided tools to get real-time information. Do not make up answers.
    2.  **Synthesize, Don't Just Dump**: When a tool returns data, present it in a clean, human-readable format. For example, instead of raw JSON, list users or orders with their key details.
    3.  **Be Data-Driven**: Base your answers on the output of the tools. If a tool returns no data, say "I couldn't find any data for that request."
    4.  **Handle Ambiguity**: If a request is unclear (e.g., "how's business?"), ask for clarification or use a general tool like 'getAppStatus' to provide a helpful summary.
    5.  **Perform Actions**: If the admin asks you to create something, like a coupon, use the appropriate tool (e.g., 'createCoupon'). Confirm the action was successful.
    6.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful. Do not mention you are an AI model.`;

    const allTools = Object.values(tools);

    const runner = ai.defineFlow(
      {
        name: 'adminAssistantRunner',
        input: { schema: z.string() },
        output: { schema: z.string() },
      },
      async (prompt) => {
        const llmResponse = await ai.generate({
          model: 'googleai/gemini-1.5-flash-latest',
          tools: allTools,
          prompt: prompt,
          history: history,
          system: systemPrompt,
          config: { temperature: 0.1 },
        });

        return llmResponse.text;
      }
    );

    try {
        const reply = await runner(message);
        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("[Admin AI] Genkit runner failed:", error);
        return NextResponse.json({ error: error.message || 'The AI failed to process the request.' }, { status: 500 });
    }
}
