
'use server';

/**
 * @fileOverview A flow to generate a marketing description for a wedding service.
 * This now directly calls the Groq API via a helper function.
 */
import { z } from 'zod';

const groqApiKey = process.env.GROQ_API_KEY;

const GenerateServiceDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the service or product.'),
  category: z.string().describe('The category of the service (e.g., Invitation Videos, Album Design).'),
});
export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated marketing description for the service.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;


export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  if (!groqApiKey) {
    throw new Error('Groq API key is not configured.');
  }

  const prompt = `You are a professional marketing copywriter for a wedding services company called "ApnaBandhan".
Your task is to write a compelling, elegant, and brief description for a service.
The description should be around 20-30 words. Respond with ONLY the description text, no extra formatting or quotation marks.

Service Name: "${input.name}"
Service Category: "${input.category}"

Write a description that is both informative and enticing to potential customers.
Focus on the benefits and the emotional aspect of the service.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Groq API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const description = result.choices[0]?.message?.content?.trim() || '';
    
    if (!description) {
        throw new Error("Failed to generate a description from the AI.");
    }
        
    return { description };

  } catch (error: any) {
    console.error("Error in generateServiceDescription:", error);
    throw new Error(error.message || "Failed to generate description.");
  }
}
