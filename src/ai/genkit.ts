
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { dotprompt } from '@genkit-ai/dotprompt';

// Configure Genkit to use Google's Gemini models
export const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt(),
  ],
});
