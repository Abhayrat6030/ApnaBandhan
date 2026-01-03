
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, Save, Wand2, Tag } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase, errorEmitter } from '@/firebase';
import type { AppSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FirestorePermissionError } from '@/firebase/errors';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  aiCustomInstructions: z.string().optional(),
  activeCoupons: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminAISettingsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSaving, setIsSaving] = useState(false);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'app-settings', 'ai-prompt') : null, [db]);
  const { data: appSettings, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aiCustomInstructions: '',
      activeCoupons: '',
    },
  });

  useEffect(() => {
    if (appSettings) {
      form.setValue('aiCustomInstructions', appSettings.aiCustomInstructions || '');
      form.setValue('activeCoupons', appSettings.activeCoupons || '');
    }
  }, [appSettings, form]);

  async function onSubmit(values: FormValues) {
    if (!db || !settingsRef) {
      toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    
    const newSettings: FormValues = {
        aiCustomInstructions: values.aiCustomInstructions,
        activeCoupons: values.activeCoupons,
    };

    setDoc(settingsRef, newSettings, { merge: true })
        .then(() => {
            toast({
                title: 'AI Settings Saved!',
                description: 'The AI will now use your updated instructions.',
            });
        })
        .catch((error) => {
            console.error("AI Settings save error:", error);
             const contextualError = new FirestorePermissionError({
              path: settingsRef.path,
              operation: 'write',
              requestResourceData: newSettings
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({
                title: 'Save Failed',
                description: "Could not save AI settings. Please check permissions.",
                variant: "destructive",
            });
        })
        .finally(() => {
            setIsSaving(false);
        });
  }

  const renderSkeleton = () => (
    <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full max-w-lg mt-1" />
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
    </Card>
  )

  if (areSettingsLoading) {
      return (
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
              <div className="flex items-center">
                  <h1 className="font-headline text-lg font-semibold md:text-2xl">AI Settings</h1>
              </div>
              {renderSkeleton()}
          </main>
      )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">AI Settings</h1>
      </div>
      <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 className="w-6 h-6"/> AI Behavior</CardTitle>
          <CardDescription>Provide custom instructions, facts, or context for the AI assistant. It will use this information in its conversations with users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="aiCustomInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Instructions for the AI</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Our top-selling package is the 'Premium Cinematic Combo'. Always recommend it." 
                        {...field} 
                        rows={8}
                      />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">You can provide FAQs, product details, or specific answers you want the AI to give.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="activeCoupons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Tag className="w-4 h-4"/> Active Coupons</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., DIWALI20 for 20% off, WELCOME10 for 10% off"
                        {...field}
                      />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">Enter currently active coupons here. The AI will provide these to users who ask for a discount.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
