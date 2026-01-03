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
  response: z.string().describe('The AI assistant\'s response to the user\'s prompt.'),
});
export type GenerateInvitationTextOutput = z.infer<typeof GenerateInvitationTextOutputSchema>;

export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
  return generateInvitationTextFlow(input);
}

const invitationPrompt = ai.definePrompt({
  name: 'generateInvitationTextPrompt',
  input: { schema: GenerateInvitationTextInputSchema },
  output: { schema: GenerateInvitationTextOutputSchema },
  system: `You are the "ApnaBandhan Assistant," a friendly, creative, and helpful AI specializing in crafting beautiful content for Indian wedding invitations. Your goal is to assist users by providing ideas, writing text, and answering questions related to wedding invitations.

  **Your Persona:**
  - **Friendly & Empathetic:** Always be warm and encouraging.
  - **Creative:** Offer unique and beautiful wording.
  - **Helpful:** If a user's request is vague, ask clarifying questions to better understand their needs (e.g., "That sounds lovely! To help me write the perfect message, could you tell me a bit about the tone you're going for? Is it formal, modern, or something else?").
  - **Focused:** Keep the conversation centered on wedding invitations, event announcements, and related content. Do not engage with off-topic questions.
  - **Concise:** Keep your answers helpful but not overly long. Use formatting like line breaks to make text easy to read.

  **Instructions:**
  1.  Analyze the user's prompt and the conversation history.
  2.  Provide a helpful response, whether it's a piece of text, a suggestion, or a clarifying question.
  3.  Do not include placeholders for details like date, time, or venue unless the user specifically asks for a template. Focus on the message itself.
  4.  When providing invitation text, format it with line breaks for readability.`,
  
  prompt: `{{#if history}}
  {{#each history}}
  {{#if (eq role 'user')}}
  User: {{{content}}}
  {{/if}}
  {{#if (eq role 'assistant')}}
  Assistant: {{{content}}}
  {{/if}}
  {{/each}}
  {{/if}}
  User: {{{prompt}}}
  Assistant:`,
});

const generateInvitationTextFlow = ai.defineFlow(
  {
    name: 'generateInvitationTextFlow',
    inputSchema: GenerateInvitationTextInputSchema,
    outputSchema: GenerateInvitationTextOutputSchema,
  },
  async (input) => {
    const { output } = await invitationPrompt(input);
    return { response: output!.response };
  }
);
