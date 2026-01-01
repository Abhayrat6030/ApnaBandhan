
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { collection, addDoc, doc, writeBatch } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  target: z.enum(['all', 'specific']),
  userId: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(10, 'Description is required.'),
  type: z.enum(['general', 'offer', 'order']),
}).refine(data => data.target !== 'specific' || !!data.userId, {
  message: "Please select a user.",
  path: ["userId"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target: 'all',
      title: '',
      description: '',
      type: 'general',
    },
  });

  const watchTarget = form.watch('target');

  async function onSubmit(values: FormValues) {
    if (!db) {
        toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    const newNotification = {
        title: values.title,
        description: values.description,
        type: values.type,
        date: new Date().toISOString(),
        read: false,
    };

    try {
        if (values.target === 'all') {
            if (!users || users.length === 0) {
                throw new Error("No users found to send notifications to.");
            }
            // Batch write for sending to all users
            const batch = writeBatch(db);
            users.forEach(user => {
                const notificationRef = doc(collection(db, `users/${user.uid}/notifications`));
                batch.set(notificationRef, newNotification);
            });
            await batch.commit();
            toast({
                title: 'Success!',
                description: `Notification sent to all ${users.length} users.`,
            });
        } else if (values.target === 'specific' && values.userId) {
            const notificationsCollection = collection(db, `users/${values.userId}/notifications`);
            await addDoc(notificationsCollection, newNotification);
             toast({
                title: 'Success!',
                description: `Notification sent to user.`,
            });
        }
        form.reset({ target: 'all', title: '', description: '', type: 'general' });
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Something went wrong.',
            variant: 'destructive',
        });
    }

    setIsLoading(false);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Send Notification</h1>
      </div>
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Compose Notification</CardTitle>
          <CardDescription>Send a custom notification to your users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">All Users</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="specific" />
                          </FormControl>
                          <FormLabel className="font-normal">Specific User</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchTarget === 'specific' && (
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={areUsersLoading ? "Loading users..." : "Select a user"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!areUsersLoading && users?.map(user => (
                            <SelectItem key={user.uid} value={user.uid}>{user.displayName} ({user.email})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g. Special Diwali Offer!" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the notification..." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="order">Order Update</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Notification
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
