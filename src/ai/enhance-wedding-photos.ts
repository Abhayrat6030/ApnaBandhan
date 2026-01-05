
'use server';

import { ai } from './index';
import { z } from 'zod';

export const EnhanceWeddingPhotosInputSchema = z.object({
  photoDataUri: z.string().refine(
    (uri) => uri.startsWith('data:image/'),
    { message: "Must be a valid data URI for an image." }
  ).describe("A photo of a wedding, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export const EnhanceWeddingPhotosOutputSchema = z.string().describe("The enhanced photo as a data URI.");

const enhanceWeddingPhotosPrompt = ai.definePrompt({
  name: 'enhanceWeddingPhotosPrompt',
  input: { schema: EnhanceWeddingPhotosInputSchema },
  output: { format: 'uri' },
  prompt: `You are an expert photo editor specializing in wedding photography.
  Enhance the following wedding photo to make it look more professional, vibrant, and clear.
  Improve lighting, colors, and sharpness.
  
  Photo: {{media url=photoDataUri}}`,
});

const enhanceWeddingPhotosFlow = ai.defineFlow(
  {
    name: 'enhanceWeddingPhotosFlow',
    inputSchema: EnhanceWeddingPhotosInputSchema,
    outputSchema: EnhanceWeddingPhotosOutputSchema,
  },
  async (input) => {
    const llmResponse = await enhanceWeddingPhotosPrompt(input);
    const output = llmResponse.output();
    if (!output) {
      throw new Error('The model did not return an enhanced image.');
    }
    return output;
  }
);

export async function enhanceWeddingPhotos(input: z.infer<typeof EnhanceWeddingPhotosInputSchema>): Promise<string> {
    const result = await enhanceWeddingPhotosFlow(input);
    return result;
}
