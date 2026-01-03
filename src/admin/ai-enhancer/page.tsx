
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { enhanceImage } from './actions';
import { Loader2, Sparkles, UploadCloud } from 'lucide-react';

function parseSuggestionsFromDataUri(dataUri: string): string {
  try {
    const base64Part = dataUri.split(',')[1];
    if (!base64Part) return "Could not parse suggestions.";
    return Buffer.from(base64Part, 'base64').toString('utf-8');
  } catch (e) {
    return "An error occurred while parsing suggestions.";
  }
}

export default function AiEnhancerPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
            title: "File too large",
            description: "Please upload an image smaller than 4MB.",
            variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEnhancedSuggestions(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!originalImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setEnhancedSuggestions(null);
    try {
      const result = await enhanceImage(originalImage);
      if (result.success && result.enhancedPhotoDataUri) {
        // The result is a text-based data URI with suggestions.
        const suggestions = parseSuggestionsFromDataUri(result.enhancedPhotoDataUri);
        setEnhancedSuggestions(suggestions);
        toast({
          title: "Suggestions Generated!",
          description: "The AI has provided enhancement advice.",
        });
      } else {
        throw new Error(result.error || 'Failed to get enhancement suggestions.');
      }
    } catch (error: any) {
      toast({
        title: "Enhancement Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">AI Photo Enhancer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get AI Enhancement Suggestions</CardTitle>
          <CardDescription>
            Upload a photo to get AI-powered suggestions on how to improve its quality, clarity, and color balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
             <p className="text-xs text-muted-foreground mt-1">Max file size: 4MB.</p>
          </div>

          {originalImage && (
            <div className="text-center">
              <Button onClick={handleEnhance} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <h3 className="font-headline text-lg font-semibold text-center">Original</h3>
              <div className="aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                {originalImage ? (
                  <Image src={originalImage} alt="Original" width={600} height={400} className="rounded-md object-contain h-full w-full" />
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <UploadCloud className="mx-auto h-12 w-12 mb-2" />
                    <p>Upload an image to get started</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-lg font-semibold text-center">AI Suggestions</h3>
              <div className="aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 p-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground p-4">
                     <Loader2 className="mx-auto h-12 w-12 animate-spin mb-2" />
                     <p>AI is processing the request...</p>
                  </div>
                ) : enhancedSuggestions ? (
                  <div className="text-sm text-left whitespace-pre-wrap">{enhancedSuggestions}</div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <Sparkles className="mx-auto h-12 w-12 mb-2" />
                    <p>Enhancement suggestions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
