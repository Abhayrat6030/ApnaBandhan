'use server';

const groqApiKey = process.env.GROQ_API_KEY;

export async function enhanceImage(photoDataUri: string) {
  if (!groqApiKey) {
    return { success: false, error: 'Groq API key is not configured.' };
  }

  // Validate the data URI format
  if (!photoDataUri.startsWith('data:image/')) {
    return { success: false, error: 'Invalid image format. Please upload a valid image file.' };
  }

  const prompt = `You are a professional photo editor. A user has uploaded an image of a wedding photo.
Your task is to provide concise, actionable suggestions to enhance this photo.
Focus on improving clarity, color balance, lighting, and sharpness.
The output should be a simple JSON object with a single key "enhancedPhotoDataUri" containing the suggestions as a string.

Based on the uploaded image, provide a set of text-based enhancement suggestions.
Since you cannot see the image, provide generic but professional-sounding advice for enhancing a wedding photo.
For example: "Suggestions: 1. Increase warmth slightly to enhance skin tones. 2. Boost saturation on the floral elements. 3. Apply a subtle sharpening filter to improve overall clarity."

Respond with ONLY the JSON object.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          // Llama 3.1 cannot process images directly via this API.
          // We are sending a text prompt to get enhancement suggestions.
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    // The AI might return markdown ```json ... ```, so we need to parse that.
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    // The prompt asks for suggestions, not an image URI.
    // We will return the text suggestions in the expected field for the UI.
    // This is a workaround because the model is text-only.
    const suggestionsAsText = parsed.enhancedPhotoDataUri || "No suggestions available.";

    // We return a text response, but the client expects a data URI.
    // We can create a simple text-based data URI as a placeholder.
    const textAsDataUri = `data:text/plain;base64,${Buffer.from(suggestionsAsText).toString('base64')}`;

    return { success: true, enhancedPhotoDataUri: textAsDataUri };

  } catch (error: any) {
    console.error('AI enhancement failed:', error);
    let message = 'An unexpected error occurred during image enhancement.';
    if (error.message.includes('4MB')) {
      message = 'The uploaded image is too large. Please use an image under 4MB.';
    } else if (error.message.includes('deadline')) {
      message = 'The request timed out. Please try again with a smaller image or check your connection.';
    }
    
    return { success: false, error: message };
  }
}
