
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
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

const formSchema = z.object({
  downloadAppLink: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSaving, setIsSaving] = useState(false);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'app-settings', 'links') : null, [db]);
  const { data: appSettings, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      downloadAppLink: '',
    },
  });

  useEffect(() => {
    if (appSettings) {
      form.setValue('downloadAppLink', appSettings.downloadAppLink || '');
    }
  }, [appSettings, form]);

  async function onSubmit(values: FormValues) {
    if (!db || !settingsRef) {
      toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    
    const newSettings = {
        downloadAppLink: values.downloadAppLink
    };

    setDoc(settingsRef, newSettings, { merge: true })
        .then(() => {
            toast({
                title: 'Settings Saved!',
                description: 'Your application settings have been updated.',
            });
        })
        .catch((error) => {
            console.error("Settings save error:", error);
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
    <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full max-w-sm mt-1" />
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
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
                  <h1 className="font-headline text-lg font-semibold md:text-2xl">App Settings</h1>
              </div>
              {renderSkeleton()}
          </main>
      )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">App Settings</h1>
      </div>
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage global settings for your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="downloadAppLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Download App Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://play.google.com/store/apps/..." {...field} />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">This link will be used in the user's profile for the "Download App" button.</p>
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
