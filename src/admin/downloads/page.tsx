
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import { Loader2, DownloadCloud, Trash2, Edit, FileVideo, FileImage } from 'lucide-react';
import { collection, addDoc, doc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { UserProfile, DownloadableProduct } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const addFormSchema = z.object({
  userId: z.string().min(1, 'Please select a user.'),
  name: z.string().min(3, 'Product name is required.'),
  type: z.enum(['Image', 'Video']),
  downloadUrl: z.string().url('Please enter a valid URL.'),
  orderId: z.string().optional(),
});
type AddFormValues = z.infer<typeof addFormSchema>;

const editFormSchema = z.object({
  name: z.string().min(3, 'Product name is required.'),
  type: z.enum(['Image', 'Video']),
  downloadUrl: z.string().url('Please enter a valid URL.'),
});
type EditFormValues = z.infer<typeof editFormSchema>;

export default function AdminDownloadsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const usersQuery = useMemoFirebase(() => db ? query(collection(db, 'users')) : null, [db]);
  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userDownloads, setUserDownloads] = useState<DownloadableProduct[]>([]);
  const [isFetchingDownloads, setIsFetchingDownloads] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<DownloadableProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<DownloadableProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const addForm = useForm<AddFormValues>({
    resolver: zodResolver(addFormSchema),
    defaultValues: { name: '', type: 'Video', downloadUrl: '', orderId: '' },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema)
  });

  useEffect(() => {
    if (selectedUserId && db) {
      const fetchDownloads = async () => {
        setIsFetchingDownloads(true);
        try {
          const downloadsCollection = collection(db, `users/${selectedUserId}/downloadableProducts`);
          const q = query(downloadsCollection, orderBy('deliveryDate', 'desc'));
          const querySnapshot = await getDocs(q);
          const downloads: DownloadableProduct[] = [];
          querySnapshot.forEach(doc => {
            downloads.push({ id: doc.id, ...doc.data() } as DownloadableProduct);
          });
          setUserDownloads(downloads);
        } catch (error) {
          toast({ title: "Error", description: "Could not fetch user downloads.", variant: 'destructive' });
        }
        setIsFetchingDownloads(false);
      };
      fetchDownloads();
    } else {
      setUserDownloads([]);
    }
  }, [selectedUserId, db, toast]);

  async function onAddSubmit(values: AddFormValues) {
    if (!db) return;
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
      toast({ title: 'Success!', description: `Product has been added.` });
      addForm.reset();
      if (values.userId === selectedUserId) {
          setUserDownloads(prev => [{ id: 'new', ...newDownloadableProduct } as DownloadableProduct, ...prev]);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Something went wrong.', variant: 'destructive' });
    }
    setIsLoading(false);
  }

  async function onEditSubmit(values: EditFormValues) {
    if (!itemToEdit || !selectedUserId || !db) return;
    setIsEditing(true);

    const downloadRef = doc(db, `users/${selectedUserId}/downloadableProducts`, itemToEdit.id);
    try {
        await updateDoc(downloadRef, values as any);
        toast({ title: "Success", description: "Download item updated." });
        setUserDownloads(prev => prev.map(d => d.id === itemToEdit.id ? { ...d, ...values } : d));
        setItemToEdit(null);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: 'destructive' });
    }
    setIsEditing(false);
  }

  const handleDeleteClick = (item: DownloadableProduct) => setItemToDelete(item);

  const confirmDelete = async () => {
    if (!itemToDelete || !selectedUserId || !db) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, `users/${selectedUserId}/downloadableProducts`, itemToDelete.id));
      toast({ title: "Deleted", description: "Download item has been removed." });
      setUserDownloads(prev => prev.filter(d => d.id !== itemToDelete!.id));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: 'destructive' });
    }
    setItemToDelete(null);
    setIsDeleting(false);
  };
  
  const handleEditClick = (item: DownloadableProduct) => {
    setItemToEdit(item);
    editForm.reset(item);
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <div className="mx-auto w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Add Downloadable Product</CardTitle>
              <CardDescription>Add a new file for a specific user. It will appear in their "Downloads" section.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                  <FormField
                    control={addForm.control} name="userId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select User</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={areUsersLoading ? "Loading..." : "Select a user"} /></SelectTrigger></FormControl>
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
                  <FormField control={addForm.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g. Final Wedding Highlight Video" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={addForm.control} name="type" render={({ field }) => (
                      <FormItem><FormLabel>File Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Video">Video</SelectItem><SelectItem value="Image">Image</SelectItem>
                      </SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addForm.control} name="orderId" render={({ field }) => (
                      <FormItem><FormLabel>Order ID (Optional)</FormLabel><FormControl><Input placeholder="e.g. ORD001" {...field} /></FormControl></FormItem>
                    )}/>
                  </div>
                  <FormField control={addForm.control} name="downloadUrl" render={({ field }) => (
                    <FormItem><FormLabel>Download URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DownloadCloud className="mr-2 h-4 w-4" />} Add Product
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Separator className="my-8" />
          
          <Card>
             <CardHeader>
                <CardTitle>Manage User Downloads</CardTitle>
                <CardDescription>View, edit, or delete downloadable items for a specific user.</CardDescription>
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

                <div className="mt-6 space-y-3">
                    {isFetchingDownloads ? <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : 
                    userDownloads.length > 0 ? (
                        userDownloads.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-4">
                                    {item.type === 'Video' ? <FileVideo className="h-5 w-5 text-muted-foreground" /> : <FileImage className="h-5 w-5 text-muted-foreground" />}
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Delivered: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))
                    ) : selectedUserId ? <p className="text-center text-muted-foreground p-4">No downloads found for this user.</p> : null}
                </div>
             </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete "{itemToDelete?.name}". This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!itemToEdit} onOpenChange={(open) => !open && setItemToEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Download Item</DialogTitle><DialogDescription>Update the details for this item.</DialogDescription></DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={editForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Video">Video</SelectItem><SelectItem value="Image">Image</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={editForm.control} name="downloadUrl" render={({ field }) => (<FormItem><FormLabel>Download URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="button" variant="outline" onClick={() => setItemToEdit(null)}>Cancel</Button><Button type="submit" disabled={isEditing}>{isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
