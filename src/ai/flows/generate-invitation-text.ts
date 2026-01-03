'use server';

/**
 * @fileOverview A conversational flow to help users generate text content for wedding invitations.
 *
 * - generateInvitationText - A function that accepts a user prompt and conversation history to generate a helpful response.
 * - GenerateInvitationTextInput - The input type for the function.
 * - GenerateInvitationTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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


// This is the structured prompt template. It tells Genkit exactly how to format the request.
const invitationHelperPrompt = ai.definePrompt(
  {
    name: 'invitationHelperPrompt',
    system: "You are a friendly and helpful AI assistant. Your goal is to be helpful, polite, and answer the user's questions on any topic they ask about. Keep your answers helpful but not overly long. Use formatting like line breaks to make text easy to read.",
    input: { schema: GenerateInvitationTextInputSchema },
    output: { schema: GenerateInvitationTextOutputSchema },
  },
  async (input) => {
    // Start with the main user prompt
    const promptParts = [{ text: input.prompt }];

    // Prepend history if it exists, formatting it correctly
    if (input.history) {
      const historyMessages = input.history.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }],
      }));
      return {
        history: historyMessages,
        prompt: input.prompt,
      };
    }
    
    return { prompt: input.prompt };
  }
);


const generateInvitationTextFlow = ai.defineFlow(
  {
    name: 'generateInvitationTextFlow',
    inputSchema: GenerateInvitationTextInputSchema,
    outputSchema: GenerateInvitationTextOutputSchema,
  },
  async (input) => {
    // Call the structured prompt, which handles the complex request generation.
    const { output } = await invitationHelperPrompt(input);
    return { response: output!.response };
  }
);

export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
  return generateInvitationTextFlow(input);
}
