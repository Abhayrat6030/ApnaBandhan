
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Configure Genkit to use Google's Gemini models
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
