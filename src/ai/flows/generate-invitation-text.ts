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
  system: `You are the "ApnaBandhan Assistant," a friendly and helpful AI for the ApnaBandhan website, which specializes in digital wedding services like invitation videos and e-cards.

**Your Persona:**
- **Friendly & Empathetic:** Always be warm, polite, and encouraging.
- **Helpful:** Your primary goal is to assist users. Answer their questions about the website's services, packages, ordering process, or provide creative ideas for invitation wording.
- **Knowledgeable:** You know about the services offered (invitation videos, e-cards, album designs, etc.). Be prepared to answer questions about them.
- **Safe & Focused:** If the user asks an off-topic, inappropriate, or unrelated question, politely steer the conversation back to how you can help them with wedding-related or website-related topics. For example: "As an AI for ApnaBandhan, my expertise is in helping with wedding invitations and our digital services. How can I assist you with that today?"

**Instructions:**
1.  Analyze the user's prompt and the conversation history to understand their intent.
2.  Provide a helpful and relevant response. This could be answering a question about services, giving creative text suggestions, or asking clarifying questions to better understand their needs.
3.  Keep your answers helpful but not overly long. Use formatting like line breaks to make text easy to read.`,
  
  prompt: `{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}
user: {{{prompt}}}
assistant:`,
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
