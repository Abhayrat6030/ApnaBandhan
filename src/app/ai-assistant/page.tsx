
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { generateInvitationText } from '@/ai/flows/generate-invitation-text';

const formSchema = z.object({
  brideName: z.string().min(2, "Please enter the bride's name."),
  groomName: z.string().min(2, "Please enter the groom's name."),
  eventType: z.string().min(1, "Please select an event type."),
  tone: z.string().min(1, "Please select a tone."),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AiAssistantPage() {
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: '',
      groomName: '',
      eventType: 'Wedding',
      tone: 'Formal',
      additionalInfo: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedText('');
    try {
      const result = await generateInvitationText(values);
      if (result.invitationText) {
        setGeneratedText(result.invitationText);
        toast({ title: 'Content Generated!', description: 'Your invitation text is ready.' });
      } else {
        throw new Error('AI did not return any text.');
      }
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({ title: 'Copied to Clipboard!' });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl md:text-3xl">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Invitation Assistant
            </CardTitle>
            <CardDescription>
              Let our AI help you craft the perfect words for your special occasion. Fill in the details below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="brideName" render={({ field }) => (
                    <FormItem><FormLabel>Bride's Name</FormLabel><FormControl><Input placeholder="e.g., Priya" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="groomName" render={({ field }) => (
                    <FormItem><FormLabel>Groom's Name</FormLabel><FormControl><Input placeholder="e.g., Rohan" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="eventType" render={({ field }) => (
                        <FormItem><FormLabel>Event Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="Wedding">Wedding</SelectItem>
                            <SelectItem value="Engagement">Engagement</SelectItem>
                            <SelectItem value="Save the Date">Save the Date</SelectItem>
                            <SelectItem value="Anniversary">Anniversary</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tone" render={({ field }) => (
                        <FormItem><FormLabel>Tone</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="Formal">Formal & Elegant</SelectItem>
                            <SelectItem value="Modern">Modern & Casual</SelectItem>
                            <SelectItem value="Funny">Funny & Playful</SelectItem>
                            <SelectItem value="Traditional">Traditional & Respectful</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                    <FormItem><FormLabel>Additional Details (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Mention our love for travel. Request no gifts. Include a quote by Rumi." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Content</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || generatedText) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Here is the text generated by our AI. You can copy it and use it in your invitations.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="relative">
                  <pre className="p-4 bg-secondary/50 rounded-md whitespace-pre-wrap font-body text-sm text-foreground">
                    {generatedText}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
