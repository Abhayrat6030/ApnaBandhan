
'use server';

/**
 * @fileOverview A conversational flow to help users generate text content for wedding invitations.
 * This AI uses tools to fetch real-time data about services and coupons.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/provider';
import { Service, Package, Coupon } from '@/lib/types';
import { services as staticServices, packages as staticPackages } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import {googleAI} from '@genkit-ai/google-genai';

// Tool to get contact info
const getContactInfo = ai.defineTool(
    {
        name: 'getContactInfo',
        description: 'Get the contact phone number and email for the business.',
        outputSchema: z.object({
            phone: z.string(),
            email: z.string(),
        })
    },
    async () => {
        return {
            phone: siteConfig.phone,
            email: siteConfig.email,
        }
    }
);


// Tool to list available services
const listServices = ai.defineTool(
  {
    name: 'listServices',
    description: 'Get a list of all available services and packages offered by ApnaBandhan.',
    outputSchema: z.array(z.object({
        name: z.string(),
        category: z.string(),
        price: z.union([z.string(), z.number()]),
        description: z.string(),
    })),
  },
  async () => {
    // In a real app, this would fetch from Firestore, but we use static data for now.
    const allServices = [...staticServices, ...staticPackages].map(s => ({
        name: s.name,
        category: (s as Service).category || 'Combo Package',
        price: (s as Service).price || (s as Package).price,
        description: s.description,
    }));
    return allServices;
  }
);


// Tool to get available coupons
const listCoupons = ai.defineTool(
    {
        name: 'listCoupons',
        description: 'Get a list of all currently active discount coupons.',
        outputSchema: z.array(z.object({
            code: z.string(),
            discountType: z.string(),
            discountValue: z.number(),
            expiryDate: z.string(),
        }))
    },
    async () => {
        const q = query(collection(db, 'coupons'), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        const coupons: Coupon[] = [];
        querySnapshot.forEach((doc) => {
            coupons.push({ id: doc.id, ...doc.data() } as Coupon);
        });
        return coupons.map(({ code, discountType, discountValue, expiryDate }) => ({
            code,
            discountType,
            discountValue,
            expiryDate: new Date(expiryDate).toLocaleDateString(),
        }));
    }
);


// Define the structure for a single message in the conversation history
const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const GenerateInvitationTextInputSchema = z.object({
  prompt: z.string().describe("The user's latest message or question."),
  history: z.array(HistoryMessageSchema).optional().describe("The history of the conversation so far."),
});
export type GenerateInvitationTextInput = z.infer<typeof GenerateInvitationTextInputSchema>;

const GenerateInvitationTextOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response to the user's prompt."),
});
export type GenerateInvitationTextOutput = z.infer<typeof GenerateInvitationTextOutputSchema>;


const generateTextFlow = ai.defineFlow(
    {
        name: 'generateInvitationTextFlow',
        inputSchema: GenerateInvitationTextInputSchema,
        outputSchema: GenerateInvitationTextOutputSchema,
    },
    async (input) => {

        const { text } = await ai.generate({
            model: googleAI.model('gemini-pro'),
            tools: [listServices, listCoupons, getContactInfo],
            system: `You are an expert wedding content consultant for a company called "ApnaBandhan". Your name is Bandhan. Your personality is creative, warm, and professional.

Your primary goal is to provide users with beautiful, elegant, and culturally appropriate text for wedding invitations, save-the-date messages, and other wedding-related content. You can also answer questions about the company's services, pricing, and active discount coupons by using the tools provided.

Key Instructions:
1.  **Use Your Tools:** If a user asks about services, packages, pricing, or discounts, use the 'listServices' and 'listCoupons' tools to get the most up-to-date information. Do not invent details. If asked for contact information, use the 'getContactInfo' tool.
2.  **Be Creative & Evocative:** For content requests, use rich, descriptive, and emotional language.
3.  **Cultural Sensitivity:** Be mindful of Indian cultural nuances.
4.  **Structured Responses:** Format your answers clearly. Use headings, bullet points, and short paragraphs.
5.  **Language:** If the user communicates in Hindi or Hinglish, you MUST respond in the same language. Maintain a polite and formal tone in Hindi.
6.  **Maintain Persona:** Always act as Bandhan, the helpful assistant from ApnaBandhan.
`,
            history: input.history?.map(msg => ({ role: msg.role, content: [{ text: msg.content }]})),
            prompt: input.prompt,
        });
        
        const responseText = text;
        if (!responseText) {
          throw new Error("Failed to generate a response from the AI.");
        }
        
        return { response: responseText };
    }
)


export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
    return generateTextFlow(input);
}
