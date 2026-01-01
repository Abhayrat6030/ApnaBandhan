
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import { Loader2, Send, Trash2, Edit, MoreHorizontal } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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


  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);
  const usersMap = useMemo(() => new Map(users?.map(u => [u.uid, u])), [users]);

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

  const handleDeleteClick = (notification: SentNotification) => {
    setItemToDelete(notification);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete || !db) return;
    setIsDeleting(true);
    try {
        await deleteDoc(doc(db, itemToDelete.path));
        toast({title: "Notification Deleted"});
        setSentNotifications(prev => prev.filter(n => n.path !== itemToDelete!.path));
    } catch(error: any) {
        toast({title: "Error deleting", description: error.message, variant: 'destructive'})
    }
    setItemToDelete(null);
    setIsDeleting(false);
  }
  
  const handleEditClick = (notification: SentNotification) => {
    // For now, this is a placeholder. A real implementation would open a modal.
    toast({title: "Edit Clicked", description: "Edit functionality coming soon."})
  }

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="mx-auto w-full max-w-2xl">
          <Card>
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
      </div>
      
      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Sent Notifications</CardTitle>
            <CardDescription>A list of the most recent notifications sent to users.</CardDescription>
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
                                            <TableCell>{new Date(notif.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                               <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent>
                                                      <DropdownMenuItem onClick={() => handleEditClick(notif)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(notif)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                  </DropdownMenuContent>
                                               </DropdownMenu>
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
                                    <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                                        <div>
                                            <CardTitle className="text-base">{notif.title}</CardTitle>
                                            <CardDescription>{notif.userName}</CardDescription>
                                        </div>
                                         <DropdownMenu>
                                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="-mt-2 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                  <DropdownMenuItem onClick={() => handleEditClick(notif)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                  <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(notif)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                              </DropdownMenuContent>
                                           </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                                        {new Date(notif.date).toLocaleString()}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : <p className="p-6 text-center text-muted-foreground">No notifications sent yet.</p>
            )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Showing last 15 notifications.</p>
        </CardFooter>
      </Card>

    </main>
    <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the notification titled "{itemToDelete?.title}". This action cannot be undone.
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
    </>
  );
}

    