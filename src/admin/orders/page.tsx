
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service, Package } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminOrdersPage() {
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

  const ordersQuery = useMemoFirebase(() => {
      if (isUserLoading || !isAdmin || !db) return null;
      return query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
  }, [db, isAdmin, isUserLoading]);

  const servicesQuery = useMemoFirebase(() => db ? collection(db, 'services') : null, [db]);
  const packagesQuery = useMemoFirebase(() => db ? collection(db, 'comboPackages') : null, [db]);

  const { data: allOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<Package>(packagesQuery);

  const allServicesMap = useMemo(() => {
    const map = new Map<string, string>();
    if(services) services.forEach(s => map.set(s.id, s.name));
    if(packages) packages.forEach(p => map.set(p.id, p.name));
    return map;
  }, [services, packages]);

  const ordersWithServiceNames = useMemo(() => {
    if (!allOrders) return [];
    return allOrders.map(order => {
        const serviceName = allServicesMap.get(order.selectedServiceId);
        return {
            ...order,
            serviceName: serviceName || order.selectedServiceId,
        };
    });
  }, [allOrders, allServicesMap]);
  
  const isLoading = isUserLoading || (isAdmin && (areOrdersLoading || areServicesLoading || arePackagesLoading));

  const renderSkeleton = () => (
    <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
             <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">All Orders</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                </span>
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>A list of all the orders from your customers.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            renderSkeleton()
          ) : !isAdmin && !isUserLoading ? (
            <div className="p-6 text-center text-destructive-foreground bg-destructive">
               <p>You do not have permission to view this page.</p>
            </div>
          ) : allOrders && allOrders.length > 0 ? (
            <OrderTable orders={ordersWithServiceNames} />
          ) : (
             <div className="p-6 text-center text-muted-foreground">
               <p>No orders found.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
