
'use client';

import { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
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
import { deleteItem } from './actions';

type CombinedService = (Partial<Service> & Partial<Package>) & { id: string; name: string; type: 'Service' | 'Package', slug?: string };

export default function AdminServicesPage() {
  const db = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'services');
  }, [db]);

  const packagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'comboPackages');
  }, [db]);

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
    if (!itemToDelete) {
        toast({ title: "Error", description: "Could not delete item.", variant: 'destructive' });
        return;
    }

    setIsDeleting(itemToDelete.id);
    const result = await deleteItem(itemToDelete.slug || itemToDelete.id, itemToDelete.type);
    
    if (result.success) {
      toast({ title: "Success", description: `${itemToDelete.name} has been deleted.` });
    } else {
      toast({ title: "Error", description: result.error, variant: 'destructive' });
    }

    setIsDeleting(null);
    setDeleteAlertOpen(false);
    setItemToDelete(null);
  }
  
  const renderSkeleton = () => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32 sm:w-48" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
  )

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
            {isLoading ? <div className="p-4">{renderSkeleton()}</div> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
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
