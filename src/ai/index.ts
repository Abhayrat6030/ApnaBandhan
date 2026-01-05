
'use server';

import { genkit, type GenkitOptions } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const genkitOptions: GenkitOptions = {
    plugins: [googleAI()],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
};

genkit(genkitOptions);

export { genkit as ai } from 'genkit';
