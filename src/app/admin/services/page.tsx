
'use client';

import { useMemo, useState } from 'react';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader2, IndianRupee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import type { Service, Package } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

type CombinedService = (Partial<Service> & Partial<Package>) & { id: string; name: string; type: 'Service' | 'Package', slug?: string };

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminServicesPage() {
  const { user } = useUser();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const db = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!isAdmin || !db) return null;
    return collection(db, 'services');
  }, [isAdmin, db]);

  const packagesQuery = useMemoFirebase(() => {
    if (!isAdmin || !db) return null;
    return collection(db, 'comboPackages');
  }, [isAdmin, db]);

  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<Package>(packagesQuery);
  
  const allItems: CombinedService[] = useMemo(() => {
      const items: CombinedService[] = [];
      if(services) items.push(...services.map(s => ({...s, type: 'Service' } as CombinedService)));
      if(packages) items.push(...packages.map(p => ({...p, name: p.name, id: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'), type: 'Package', price: parseFloat(p.price.replace(/[^0-9.-]+/g,"")) } as CombinedService)));
      return items.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  }, [services, packages]);
  
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CombinedService | null>(null);

  const isLoading = areServicesLoading || arePackagesLoading;

  const handleDeleteClick = (item: CombinedService) => {
    setItemToDelete(item);
    setDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete || !user || !db) {
        toast({ title: "Error", description: "Could not delete item. User not found or DB not available.", variant: 'destructive' });
        return;
    }

    setIsDeleting(itemToDelete.id);
    
    try {
        const collectionName = itemToDelete.type === 'Service' ? 'services' : 'comboPackages';
        const itemRef = doc(db, collectionName, itemToDelete.slug || itemToDelete.id);
        await deleteDoc(itemRef);
        toast({ title: "Success", description: `${itemToDelete.name} has been deleted.` });
    } catch (error: any) {
        toast({ title: "Error", description: error.message || 'Failed to delete item.', variant: 'destructive' });
    }

    setIsDeleting(null);
    setDeleteAlertOpen(false);
    setItemToDelete(null);
  }
  
  const renderSkeleton = () => (
      <div className="p-4 md:p-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32 sm:w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="block md:hidden space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
        </div>
      </div>
  )

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Services</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="h-8 gap-1">
              <Link href="/admin/services/new">
                <PlusCircle className="h-3.5 w-3.5" />
                 <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New
                </span>
              </Link>
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services & Packages</CardTitle>
          <CardDescription>Add, edit, or remove services offered on the website.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            {isLoading ? renderSkeleton() : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium truncate max-w-[250px]">{item.name}</TableCell>
                          <TableCell className="capitalize">
                            <Badge variant={item.type === 'Package' ? 'secondary' : 'outline'}>
                                {item.category?.replace('-', ' ') || 'Package'}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{item.price?.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!isDeleting}>
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/services/edit/${item.slug || item.id}`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={() => handleDeleteClick(item)}
                                  disabled={isDeleting === item.id}
                                >
                                  {isDeleting === item.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="mr-2 h-4 w-4" />
                                  )}
                                  Delete
                                </DropdownMenuItem>
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
                  {allItems.map(item => (
                      <Card key={item.id} className="w-full">
                          <CardHeader className="flex flex-row items-start justify-between p-4">
                              <div>
                                <CardTitle className="text-base">{item.name}</CardTitle>
                                 <Badge variant={item.type === 'Package' ? 'secondary' : 'outline'} className="mt-1 capitalize">
                                    {item.category?.replace('-', ' ') || 'Package'}
                                </Badge>
                              </div>
                               <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!isDeleting} className="-mt-2 -mr-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/services/edit/${item.slug || item.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-destructive">
                                        {isDeleting === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                               <div className="flex items-center text-lg font-semibold">
                                  <IndianRupee className="h-4 w-4 mr-1" />
                                  {item.price?.toLocaleString('en-IN')}
                               </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
            </>
            )}
        </CardContent>
         <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{allItems.length}</strong> items.
          </div>
        </CardFooter>
      </Card>
    </main>

    <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item
                    <span className="font-bold"> {itemToDelete?.name}</span>.
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
