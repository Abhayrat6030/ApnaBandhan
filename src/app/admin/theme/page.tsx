
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, Save, Paintbrush, Image as ImageIcon } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase, errorEmitter } from '@/firebase';
import type { AppSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

const formSchema = z.object({
  heroImageUrl: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminThemeSettingsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSaving, setIsSaving] = useState(false);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'app-settings', 'theme') : null, [db]);
  const { data: appSettings, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroImageUrl: '',
    },
  });

  const heroImageUrl = form.watch('heroImageUrl');

  useEffect(() => {
    if (appSettings) {
      form.setValue('heroImageUrl', appSettings.heroImageUrl || '');
    }
  }, [appSettings, form]);

  async function onSubmit(values: FormValues) {
    if (!db || !settingsRef) {
      toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    
    const newSettings = {
        heroImageUrl: values.heroImageUrl
    };

    setDoc(settingsRef, newSettings, { merge: true })
        .then(() => {
            toast({
                title: 'Theme Settings Saved!',
                description: 'Your theme settings have been updated.',
            });
        })
        .catch((error) => {
            console.error("Theme Settings save error:", error);
             const contextualError = new FirestorePermissionError({
              path: settingsRef.path,
              operation: 'write',
              requestResourceData: newSettings
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({
                title: 'Save Failed',
                description: "Could not save settings. Please check permissions.",
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
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-full rounded-lg" />
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
                  <h1 className="font-headline text-lg font-semibold md:text-2xl">Theme Settings</h1>
              </div>
              {renderSkeleton()}
          </main>
      )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Theme Settings</h1>
      </div>
      <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Paintbrush className="w-6 h-6"/> Visual Theme</CardTitle>
          <CardDescription>Manage visual elements of your website, like the homepage banner.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Homepage Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.jpg" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">This image will be used as the background for the main banner on your homepage.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {heroImageUrl && (
                <div>
                  <FormLabel>Image Preview</FormLabel>
                  <div className="mt-2 relative aspect-video w-full rounded-lg border bg-muted/30 overflow-hidden">
                    <Image src={heroImageUrl} alt="Hero image preview" fill className="object-cover" />
                  </div>
                </div>
              )}

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
