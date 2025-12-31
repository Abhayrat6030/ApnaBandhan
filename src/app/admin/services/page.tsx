
'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useMemoFirebase, db } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Service, Package } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type CombinedService = (Service | Partial<Package>) & { type: 'Service' | 'Package' };

export default function AdminServicesPage() {
  const servicesQuery = useMemoFirebase(() => {
    return collection(db, 'services');
  }, []);

  const packagesQuery = useMemoFirebase(() => {
    return collection(db, 'comboPackages');
  }, []);

  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<Package>(packagesQuery);
  
  const allItems: CombinedService[] = useMemo(() => {
      const items: CombinedService[] = [];
      if(services) items.push(...services.map(s => ({...s, type: 'Service' } as CombinedService)));
      if(packages) items.push(...packages.map(p => ({...p, name: p.name, price: parseFloat(p.price.replace(/[^0-9.-]+/g,"")), type: 'Package' } as CombinedService)));
      return items.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  }, [services, packages]);
  
  const isLoading = areServicesLoading || arePackagesLoading;
  
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
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
  );
}
