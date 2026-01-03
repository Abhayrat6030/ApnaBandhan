'use server';

import { ai } from '@/ai/genkit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listNewUsers, listRecentOrders } from './tools';

const adminAssistant = ai.definePrompt(
  {
    name: 'adminAssistant',
    input: {
      schema: z.object({
        history: z.array(z.any()),
        message: z.string(),
      }),
    },
  },
  async (input) => {
    return {
      prompt: `You are a powerful and knowledgeable admin assistant for the e-commerce website "ApnaBandhan".

Your role is to provide the website administrator with clear, concise, and accurate data-driven insights about the business. You have access to powerful tools that can query the live database for information about users and orders.

Key Instructions:
1.  **Be Factual and Data-Driven**: Your primary goal is to answer the admin's questions using the data provided by your tools. Do not make up information. If you don't know, say you don't have the data.
2.  **Use Your Tools**: You MUST use your tools to answer questions about users and orders.
    - Use 'listNewUsers' when asked about user sign-ups, referral codes, or user details.
    - Use 'listRecentOrders' when asked about orders, sales, or customer purchase history.
3.  **Summarize Clearly**: When you get data from a tool, do not just dump the raw JSON. Summarize it in a clear, human-readable format. Use lists, bold text, and clear headings.
    - Example: Instead of \`{"name": "Rohan", "email": "r@ex.com"}\`, say:
      "**Rohan** (r@ex.com) signed up on..."
4.  **Specify Timeframes**: When using tools, you can specify timeframes like 'today', 'this week', or 'this month'. Understand the user's intent (e.g., "new users" implies recent ones).
5.  **Maintain Admin Persona**: You are a professional assistant. Be direct, clear, and helpful.

The admin will now ask you a question. Use your tools to provide the best possible answer.`,
      history: input.history,
      tools: [listNewUsers, listRecentOrders],
    };
  }
);


export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  try {
    const { output } = await adminAssistant({
        history: history || [],
        message: message,
    });

    return NextResponse.json({
        reply: output,
    });
  } catch (error: any) {
    console.error("Admin Assistant API Error:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
