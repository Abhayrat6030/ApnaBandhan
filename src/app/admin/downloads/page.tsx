
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, DownloadCloud } from 'lucide-react';
import { collection, addDoc, doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';

const formSchema = z.object({
  userId: z.string().min(1, 'Please select a user.'),
  name: z.string().min(3, 'Product name is required.'),
  type: z.enum(['Image', 'Video']),
  downloadUrl: z.string().url('Please enter a valid URL.'),
  orderId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminDownloadsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'Video',
      downloadUrl: '',
      orderId: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!db) {
      toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    const newDownloadableProduct = {
      name: values.name,
      type: values.type,
      deliveryDate: new Date().toISOString(),
      downloadUrl: values.downloadUrl,
      orderId: values.orderId || '',
    };
    
    try {
      const downloadsCollection = collection(db, `users/${values.userId}/downloadableProducts`);
      await addDoc(downloadsCollection, newDownloadableProduct);
      toast({
        title: 'Success!',
        description: `Product has been added to the user's download section.`,
      });
      form.reset();
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
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Add Downloadable Product</h1>
      </div>
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Add a new downloadable file for a specific user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g. Final Wedding Highlight Video" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem><FormLabel>File Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Image">Image</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name="orderId" render={({ field }) => (
                    <FormItem><FormLabel>Order ID (Optional)</FormLabel><FormControl><Input placeholder="e.g. ORD001" {...field} /></FormControl></FormItem>
                  )}/>
               </div>

              <FormField control={form.control} name="downloadUrl" render={({ field }) => (
                <FormItem><FormLabel>Download URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DownloadCloud className="mr-2 h-4 w-4" />}
                Add Product
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
