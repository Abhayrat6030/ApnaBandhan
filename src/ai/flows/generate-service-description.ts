
'use server';

/**
 * @fileOverview A flow to generate a marketing description for a wedding service.
 *
 * - generateServiceDescription - A function that accepts a service name and category and returns a description.
 * - GenerateServiceDescriptionInput - The input type for the function.
 * - GenerateServiceDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateServiceDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the service or product.'),
  category: z.string().describe('The category of the service (e.g., Invitation Videos, Album Design).'),
});
export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated marketing description for the service.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;


const descriptionPrompt = ai.definePrompt(
    {
        name: 'serviceDescriptionPrompt',
        inputSchema: GenerateServiceDescriptionInputSchema,
        output: {
            schema: GenerateServiceDescriptionOutputSchema,
        }
    },
    async (input) => {
        return {
            prompt: `You are a professional marketing copywriter for a wedding services company called "ApnaBandhan".
Your task is to write a compelling, elegant, and brief description for a service.
The description should be around 20-30 words.

Service Name: "${input.name}"
Service Category: "${input.category}"

Write a description that is both informative and enticing to potential customers.
Focus on the benefits and the emotional aspect of the service.
Do not use quotes in your response.
`,
            config: {
                temperature: 0.7,
            },
        }
    }
);


const generateDescriptionFlow = ai.defineFlow(
    {
        name: 'generateDescriptionFlow',
        inputSchema: GenerateServiceDescriptionInputSchema,
        outputSchema: GenerateServiceDescriptionOutputSchema,
    },
    async (input) => {
        const { output } = await descriptionPrompt.generate({
            input: input,
            model: googleAI.model('gemini-pro'),
        });

        if (!output) {
            throw new Error("Failed to generate a description.");
        }
        
        return output;
    }
);


export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateDescriptionFlow(input);
}
