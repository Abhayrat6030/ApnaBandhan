'use server';

/**
 * @fileOverview A flow to enhance wedding photos using AI.
 *
 * - enhanceWeddingPhotos - A function that accepts a wedding photo and enhances it.
 * - EnhanceWeddingPhotosInput - The input type for the enhanceWeddingPhotos function.
 * - EnhanceWeddingPhotosOutput - The return type for the enhanceWeddingPhotos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceWeddingPhotosInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A wedding photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceWeddingPhotosInput = z.infer<typeof EnhanceWeddingPhotosInputSchema>;

const EnhanceWeddingPhotosOutputSchema = z.object({
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced wedding photo as a data URI.'),
});
export type EnhanceWeddingPhotosOutput = z.infer<typeof EnhanceWeddingPhotosOutputSchema>;

export async function enhanceWeddingPhotos(input: EnhanceWeddingPhotosInput): Promise<EnhanceWeddingPhotosOutput> {
  const {media} = await ai.generate({
    prompt: [
        {
        media: {url: input.photoDataUri},
        },
        {
        text: 'Enhance this wedding photo to improve its quality and make it look more professional. Focus on improving clarity, color balance, and sharpness. Return the enhanced image as a data URI.',
        },
    ],
    model: ai.getModel('google/gemini-flash-1.5-latest'),
    config: {
        responseModalities: ['TEXT', 'IMAGE'],
    },
  });
  return {enhancedPhotoDataUri: media!.url!};
}
