
'use server';

/**
 * @fileOverview A flow to generate text content for wedding invitations.
 *
 * - generateInvitationText - A function that accepts details and generates invitation text.
 * - GenerateInvitationTextInput - The input type for the function.
 * - GenerateInvitationTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInvitationTextInputSchema = z.object({
  brideName: z.string().describe("The name of the bride."),
  groomName: z.string().describe("The name of the groom."),
  eventType: z.string().describe("The type of event (e.g., Wedding, Engagement, Save the Date)."),
  tone: z.string().describe("The desired tone for the invitation (e.g., Formal, Modern, Funny, Traditional)."),
  additionalInfo: z.string().optional().describe("Any additional details or requests to include in the text, like mentioning a theme, a quote, or specific requests for guests."),
});
export type GenerateInvitationTextInput = z.infer<typeof GenerateInvitationTextInputSchema>;

const GenerateInvitationTextOutputSchema = z.object({
  invitationText: z.string().describe('The complete, well-formatted invitation text.'),
});
export type GenerateInvitationTextOutput = z.infer<typeof GenerateInvitationTextOutputSchema>;

export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
  return generateInvitationTextFlow(input);
}

const invitationPrompt = ai.definePrompt({
  name: 'generateInvitationTextPrompt',
  input: { schema: GenerateInvitationTextInputSchema },
  output: { schema: GenerateInvitationTextOutputSchema },
  prompt: `You are a creative and empathetic writer specializing in crafting beautiful content for Indian wedding invitations. Your task is to generate a heartfelt and appropriate invitation message based on the user's provided details.

  **Instructions:**
  1.  **Analyze the Details:** Carefully consider the names, event type, and desired tone.
  2.  **Incorporate Additional Info:** Seamlessly weave in any additional details provided by the user. If they provide a quote, make sure to include it naturally.
  3.  **Craft the Message:** Write a complete invitation message. It should be warm, inviting, and suitable for the occasion.
  4.  **Formatting:** Use line breaks (\n) to structure the text into paragraphs for better readability. Do not use markdown.
  5.  **Placeholders:** Do not include placeholders for date, time, or venue. The user will add these details later. Focus only on the invitation message itself.

  **User Provided Details:**
  - **Bride's Name:** {{brideName}}
  - **Groom's Name:** {{groomName}}
  - **Event Type:** {{eventType}}
  - **Desired Tone:** {{tone}}
  - **Additional Details:** {{{additionalInfo}}}

  Generate the invitation text now.
  `,
});

const generateInvitationTextFlow = ai.defineFlow(
  {
    name: 'generateInvitationTextFlow',
    inputSchema: GenerateInvitationTextInputSchema,
    outputSchema: GenerateInvitationTextOutputSchema,
  },
  async (input) => {
    const { output } = await invitationPrompt(input);
    return output!;
  }
);
