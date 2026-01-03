'use server';
import { config } from 'dotenv';
config();

// This will register all flows and tools with Genkit
import '@/ai/flows/generate-invitation-text';
