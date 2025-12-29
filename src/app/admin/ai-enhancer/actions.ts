'use server';

import { enhanceWeddingPhotos } from '@/ai/flows/enhance-wedding-photos';

export async function enhanceImage(photoDataUri: string) {
  try {
    // Validate the data URI format
    if (!photoDataUri.startsWith('data:image/')) {
        return { success: false, error: 'Invalid image format. Please upload a valid image file.' };
    }

    const result = await enhanceWeddingPhotos({ photoDataUri });
    return { success: true, enhancedPhotoDataUri: result.enhancedPhotoDataUri };
  } catch (error: any) {
    console.error('AI enhancement failed:', error);
    // Provide a more user-friendly error message
    let message = 'An unexpected error occurred during image enhancement.';
    if (error.message.includes('4MB')) {
        message = 'The uploaded image is too large. Please use an image under 4MB.'
    } else if (error.message.includes('deadline')) {
        message = 'The request timed out. Please try again with a smaller image or check your connection.'
    }
    
    return { success: false, error: message };
  }
}
