
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useUser, db } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { packages, services as staticServices } from '@/lib/data';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminOrdersPage() {
  const { user, isUserLoading } = useUser();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const ordersQuery = useMemoFirebase(() => {
      if (!isAdmin) return null;
      return query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
  }, [isAdmin]);

  const { data: allOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  const allServicesMap = useMemo(() => {
    const map = new Map<string, string>();
    staticServices.forEach(s => map.set(s.id, s.name));
    packages.forEach(p => map.set(p.id, p.name));
    return map;
  }, []);

  const ordersWithServiceNames = useMemo(() => {
    if (!allOrders) return [];
    return allOrders.map(order => ({
      ...order,
      serviceName: allServicesMap.get(order.selectedServiceId) || 'Unknown Service',
    }));
  }, [allOrders, allServicesMap]);
  
  const isLoading = isUserLoading || areOrdersLoading;

  const renderSkeleton = () => (
    <div className="p-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-10 w-full" />
            </div>
        ))}
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
          {isLoading && !allOrders ? (
            renderSkeleton()
          ) : !isAdmin ? (
            <div className="p-6 text-center text-muted-foreground">
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
