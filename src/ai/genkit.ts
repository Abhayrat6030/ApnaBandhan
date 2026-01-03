'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Configure Genkit to use OpenRouter with a Google AI compatible endpoint
export const ai = genkit({
  plugins: [
    googleAI({
      apiEndpoint: 'https://openrouter.ai/api/v1',
      apiKey: process.env.GEMINI_API_KEY, // This will be passed as Authorization header
    }),
  ],
  // Update model name to be compatible with OpenRouter
  model: 'google/gemini-flash-1.5-latest',
});
