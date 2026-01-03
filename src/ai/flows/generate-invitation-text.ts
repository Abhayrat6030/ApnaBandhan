'use server';

/**
 * @fileOverview A conversational flow to help users generate text content for wedding invitations.
 * This function now calls the internal Groq API endpoint.
 */
import { z } from 'zod';

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
    try {
        const response = await fetch('http://localhost:3000/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: input.prompt,
                history: input.history,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `API request failed with status ${response.status}`);
        }

        const result = await response.json();
        return { response: result.reply };

    } catch (error: any) {
        console.error("Error calling AI API route:", error);
        // Re-throw the error so the client-side can catch it
        throw new Error(error.message || 'Failed to communicate with the AI assistant.');
    }
}
