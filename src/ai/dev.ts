'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-invitation-text.ts';
import '@/ai/flows/generate-service-description.ts';
