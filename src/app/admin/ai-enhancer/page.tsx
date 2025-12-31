'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { enhanceImage } from './actions';
import { Loader2, Sparkles, UploadCloud } from 'lucide-react';

export default function AiEnhancerPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
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
        setEnhancedImage(null);
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
    setEnhancedImage(null);
    try {
      const result = await enhanceImage(originalImage);
      if (result.success && result.enhancedPhotoDataUri) {
        setEnhancedImage(result.enhancedPhotoDataUri);
        toast({
          title: "Image Enhanced Successfully!",
          description: "The AI has worked its magic.",
        });
      } else {
        throw new Error(result.error || 'Failed to enhance image.');
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
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-2xl md:text-3xl font-bold mb-6">AI Photo Enhancer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enhance Wedding Photos</CardTitle>
          <CardDescription>
            Upload a photo to automatically improve its quality, clarity, and color balance using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-md">
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
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance with AI
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
              <h3 className="font-headline text-lg font-semibold text-center">Enhanced</h3>
              <div className="aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                {isLoading ? (
                  <div className="text-center text-muted-foreground p-4">
                     <Loader2 className="mx-auto h-12 w-12 animate-spin mb-2" />
                     <p>AI is processing the image...</p>
                  </div>
                ) : enhancedImage ? (
                  <Image src={enhancedImage} alt="Enhanced" width={600} height={400} className="rounded-md object-contain h-full w-full" />
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <Sparkles className="mx-auto h-12 w-12 mb-2" />
                    <p>Your enhanced image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
