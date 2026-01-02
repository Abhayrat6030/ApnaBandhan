
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import { Loader2, Send, Trash2, Edit } from 'lucide-react';
import { collection, addDoc, doc, writeBatch, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    path: string; // The full path to the document, e.g., users/{userId}/notifications/{notificationId}
    userName?: string;
    userEmail?: string;
}


export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [isFetchingSent, setIsFetchingSent] = useState(true);
  
  const [itemToDelete, setItemToDelete] = useState<SentNotification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [itemToEdit, setItemToEdit] = useState<SentNotification | null>(null);
  const [isEditing, setIsEditing] = useState(false);


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

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
  });

  const watchTarget = form.watch('target');
  
  const fetchSentNotifications = async () => {
      if (!db || !users) return;
      setIsFetchingSent(true);
      try {
          const allNotifs: SentNotification[] = [];
          for (const user of users) {
              const notifsCollection = collection(db, `users/${user.uid}/notifications`);
              const querySnapshot = await getDocs(notifsCollection);
              querySnapshot.forEach(doc => {
                  allNotifs.push({
                      ...(doc.data() as Notification),
                      id: doc.id,
                      path: doc.ref.path,
                      userName: user.displayName,
                      userEmail: user.email,
                  });
              });
          }
          
          allNotifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setSentNotifications(allNotifs.slice(0, 15));

      } catch (error) {
          console.error("Failed to fetch sent notifications:", error);
          toast({ title: "Error", description: "Could not fetch sent notifications.", variant: 'destructive' });
      }
      setIsFetchingSent(false);
  };

  useEffect(() => {
    if (users && users.length > 0) {
      fetchSentNotifications();
    } else if (!areUsersLoading) {
      setIsFetchingSent(false); // No users, stop fetching
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, areUsersLoading]);


  async function onSubmit(values: FormValues) {
    if (!db) {
        toast({ title: 'Error', description: 'Database not available.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    const newNotification: Omit<Notification, 'id'> = {
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
            const batch = writeBatch(db);
            users.forEach(user => {
                const notificationRef = doc(collection(db, `users/${user.uid}/notifications`));
                batch.set(notificationRef, newNotification);
            });
            await batch.commit();
            toast({
                title: 'Success!',
                description: `Message sent to all ${users.length} users.`,
            });
        } else if (values.target === 'specific' && values.userId) {
            const notificationsCollection = collection(db, `users/${values.userId}/notifications`);
            await addDoc(notificationsCollection, newNotification);
             toast({
                title: 'Success!',
                description: `Message sent to user.`,
            });
        }
        form.reset({ target: 'all', title: '', description: '', type: 'general' });
        fetchSentNotifications(); // Refresh the list
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Something went wrong.',
            variant: 'destructive',
        });
    }

    setIsLoading(false);
  }

  async function onEditSubmit(values: EditFormValues) {
      if (!itemToEdit || !db) return;
      setIsEditing(true);

      const notifRef = doc(db, itemToEdit.path);
      try {
          await updateDoc(notifRef, {
              title: values.title,
              description: values.description,
          });
          toast({ title: "Message updated successfully" });
          setSentNotifications(prev => prev.map(n => n.path === itemToEdit.path ? {...n, ...values} : n));
          setItemToEdit(null);
      } catch (error: any) {
          toast({ title: "Error updating message", description: error.message, variant: 'destructive' });
      }
      setIsEditing(false);
  }

  const handleDeleteClick = (notification: SentNotification) => {
    setItemToDelete(notification);
  };
  
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
    editForm.reset({
      title: notification.title,
      description: notification.description,
    });
  }

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Send Message / Reward</CardTitle>
              <CardDescription>Send a custom notification or reward to your users.</CardDescription>
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
                    <FormItem><FormLabel>Description / Coupon Code</FormLabel><FormControl><Textarea placeholder="Describe the message or provide a coupon code..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem><FormLabel>Message Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="general">General Notification</SelectItem>
                            <SelectItem value="offer">Offer / Reward</SelectItem>
                            <SelectItem value="order">Order Update</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Sent Messages</CardTitle>
            <CardDescription>A list of the most recent messages sent to users.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            {isFetchingSent ? <p className="p-4 text-center">Loading...</p> : (
                sentNotifications.length > 0 ? (
                    <div className="relative w-full overflow-auto">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sentNotifications.map(notif => (
                                        <TableRow key={notif.path}>
                                            <TableCell>
                                                <div className="font-medium">{notif.userName || 'N/A'}</div>
                                                <div className="text-sm text-muted-foreground">{notif.userEmail}</div>
                                            </TableCell>
                                            <TableCell>{notif.title}</TableCell>
                                            <TableCell className="capitalize">{notif.type}</TableCell>
                                            <TableCell>{new Date(notif.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                               <div className="flex gap-2 justify-end">
                                                  <Button variant="outline" size="icon" onClick={() => handleEditClick(notif)}><Edit className="h-4 w-4" /></Button>
                                                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(notif)}><Trash2 className="h-4 w-4" /></Button>
                                               </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Mobile Cards */}
                        <div className="block md:hidden p-4 space-y-4">
                            {sentNotifications.map(notif => (
                                <Card key={notif.path}>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base">{notif.title}</CardTitle>
                                        <CardDescription>
                                            {notif.userName} ({notif.userEmail}) - {new Date(notif.date).toLocaleString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditClick(notif)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                        <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDeleteClick(notif)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : <p className="p-6 text-center text-muted-foreground">No messages sent yet.</p>
            )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Showing last 15 sent messages.</p>
        </CardFooter>
      </Card>

    </main>
    <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the message titled "{itemToDelete?.title}". This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && setItemToEdit(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Message</DialogTitle>
                <DialogDescription>
                    Update the title and description for this message.
                </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                    <FormField
                        control={editForm.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={editForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setItemToEdit(null)}>Cancel</Button>
                        <Button type="submit" disabled={isEditing}>
                            {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    </>
  );
}
