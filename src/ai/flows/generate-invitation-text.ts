
'use server';

/**
 * @fileOverview A conversational flow to help users generate text content for wedding invitations.
 *
 * - generateInvitationText - A function that accepts a user prompt and conversation history to generate a helpful response.
 * - GenerateInvitationTextInput - The input type for the function.
 * - GenerateInvitationTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

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


export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
    const { text } = await ai.generate({
        model: googleAI.model('gemini-pro'),
        system: "You are a friendly and helpful AI assistant. Your goal is to be helpful, polite, and answer the user's questions on any topic they ask about. Keep your answers helpful but not overly long. Use formatting like line breaks to make text easy to read.",
        history: input.history?.map(msg => ({ role: msg.role, content: [{ text: msg.content }]})),
        prompt: input.prompt,
    });
    
    const responseText = text;
    if (!responseText) {
      throw new Error("Failed to generate a response from the AI.");
    }
    
    return { response: responseText };
}
