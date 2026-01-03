
'use server';

import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { next } from '@genkit-ai/next';

configureGenkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    next(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export { ai } from 'genkit';
