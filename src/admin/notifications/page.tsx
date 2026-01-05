
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, Send, Trash2, Edit } from 'lucide-react';
import { collection, addDoc, doc, writeBatch, getDocs, deleteDoc, updateDoc, query, orderBy, CollectionReference } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { UserProfile, Notification } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

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

const editFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(10, 'Description is required.'),
});
type EditFormValues = z.infer<typeof editFormSchema>;

interface SentNotification extends Notification {
    path: string;
    userName?: string;
    userEmail?: string;
}

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const usersQuery = useMemoFirebase(() => db ? query(collection(db, 'users') as CollectionReference<UserProfile>) : null, [db]);
  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [isFetchingSent, setIsFetchingSent] = useState(false);
  
  const [itemToDelete, setItemToDelete] = useState<SentNotification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [itemToEdit, setItemToEdit] = useState<SentNotification | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { target: 'all', title: '', description: '', type: 'general' },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
  });

  const watchTarget = form.watch('target');
  
  const fetchSentNotifications = async (userId: string) => {
      if (!db) return;
      setIsFetchingSent(true);
      try {
          const notifsCollection = collection(db, `users/${userId}/notifications`);
          const q = query(notifsCollection, orderBy('date', 'desc'));
          const querySnapshot = await getDocs(q);
          const userNotifs: SentNotification[] = [];
          const selectedUser = users?.find(u => u.uid === userId);
          querySnapshot.forEach(doc => {
              userNotifs.push({
                  ...(doc.data() as Notification),
                  id: doc.id,
                  path: doc.ref.path,
                  userName: selectedUser?.displayName,
                  userEmail: selectedUser?.email,
              });
          });
          setSentNotifications(userNotifs);
      } catch (error) {
          toast({ title: "Error", description: "Could not fetch user notifications.", variant: 'destructive' });
      }
      setIsFetchingSent(false);
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchSentNotifications(selectedUserId);
    } else {
      setSentNotifications([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);


  async function onSubmit(values: FormValues) {
    if (!db || !users) return;
    setIsSubmitting(true);

    const newNotification: Omit<Notification, 'id'> = {
        title: values.title, description: values.description, type: values.type,
        date: new Date().toISOString(), read: false,
    };

    try {
        if (values.target === 'all') {
            const batch = writeBatch(db);
            users.forEach(user => {
                const notificationRef = doc(collection(db, `users/${user.uid}/notifications`));
                batch.set(notificationRef, newNotification);
            });
            await batch.commit();
            toast({ title: 'Success!', description: `Message sent to all ${users.length} users.` });
        } else if (values.target === 'specific' && values.userId) {
            await addDoc(collection(db, `users/${values.userId}/notifications`), newNotification);
            toast({ title: 'Success!', description: `Message sent to user.` });
            if (values.userId === selectedUserId) {
                fetchSentNotifications(selectedUserId);
            }
        }
        form.reset({ target: 'all', title: '', description: '', type: 'general' });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Something went wrong.', variant: 'destructive' });
    }
    setIsSubmitting(false);
  }

  async function onEditSubmit(values: EditFormValues) {
      if (!itemToEdit || !db) return;
      setIsEditing(true);

      const notifRef = doc(db, itemToEdit.path);
      try {
          await updateDoc(notifRef, { title: values.title, description: values.description });
          toast({ title: "Message updated" });
          setSentNotifications(prev => prev.map(n => n.path === itemToEdit.path ? {...n, ...values} as SentNotification : n));
          setItemToEdit(null);
      } catch (error: any) {
          toast({ title: "Error updating message", description: error.message, variant: 'destructive' });
      }
      setIsEditing(false);
  }

  const handleDeleteClick = (notification: SentNotification) => setItemToDelete(notification);
  
  const confirmDelete = async () => {
    if (!itemToDelete || !db) return;
    setIsDeleting(true);
    try {
        await deleteDoc(doc(db, itemToDelete.path));
        toast({title: "Message Deleted"});
        setSentNotifications(prev => prev.filter(n => n.path !== itemToDelete!.path));
    } catch(error: any) {
        toast({title: "Error deleting", description: error.message, variant: 'destructive'})
    }
    setItemToDelete(null);
    setIsDeleting(false);
  }
  
  const handleEditClick = (notification: SentNotification) => {
    setItemToEdit(notification);
    editForm.reset({ title: notification.title, description: notification.description });
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Send Message / Reward</CardTitle>
              <CardDescription>Send a custom notification or reward to your users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="target" render={({ field }) => (
                      <FormItem className="space-y-3"><FormLabel>Recipient</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row gap-4">
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="all" /></FormControl><FormLabel className="font-normal">All Users</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="specific" /></FormControl><FormLabel className="font-normal">Specific User</FormLabel></FormItem>
                      </RadioGroup></FormControl><FormMessage /></FormItem>
                  )} />
                  {watchTarget === 'specific' && (
                    <FormField control={form.control} name="userId" render={({ field }) => (
                      <FormItem><FormLabel>Select User</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl>
                          <SelectTrigger><SelectValue placeholder={areUsersLoading ? "Loading..." : "Select a user"} /></SelectTrigger></FormControl><SelectContent>
                          {!areUsersLoading && users?.map(user => (<SelectItem key={user.uid} value={user.uid}>{user.displayName} ({user.email})</SelectItem>))}
                      </SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  )}
                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g. Special Diwali Offer!" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description / Coupon Code</FormLabel><FormControl><Textarea placeholder="Describe the message or provide a coupon code..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Message Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="general">General Notification</SelectItem><SelectItem value="offer">Offer / Reward</SelectItem><SelectItem value="order">Order Update</SelectItem>
                  </SelectContent></Select><FormMessage /></FormItem>)} />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Manage User Messages</CardTitle>
                <CardDescription>View, edit or delete messages sent to a specific user.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                  <Label>Select User to Manage</Label>
                  <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                    <SelectTrigger><SelectValue placeholder={areUsersLoading ? "Loading..." : "Select a user"} /></SelectTrigger>
                    <SelectContent>
                      {!areUsersLoading && users?.map(user => (
                        <SelectItem key={user.uid} value={user.uid}>{user.displayName} ({user.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-6 border rounded-md max-h-96 overflow-y-auto">
                    {isFetchingSent ? <p className="p-4 text-center text-sm text-muted-foreground">Loading messages...</p> : (
                        sentNotifications.length > 0 ? (
                            <div className="divide-y">
                                {sentNotifications.map(notif => (
                                    <div key={notif.path} className="p-3 flex items-start sm:items-center">
                                        <div className="flex-1 space-y-1 overflow-hidden">
                                            <p className="font-semibold truncate">{notif.title}</p>
                                            <p className="text-sm text-muted-foreground truncate">{notif.description}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{notif.type} &bull; {new Date(notif.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0 ml-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(notif)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(notif)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="p-6 text-center text-sm text-muted-foreground">No messages found for this user.</p>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the message titled "{itemToDelete?.title}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && setItemToEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Message</DialogTitle><DialogDescription>Update the title and description for this message.</DialogDescription></DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setItemToEdit(null)}>Cancel</Button><Button type="submit" disabled={isEditing}>{isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
