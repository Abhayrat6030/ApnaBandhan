
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useUser, db } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { packages, services as staticServices } from '@/lib/data';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminOrdersPage() {
  const { user, isUserLoading } = useUser();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const ordersQuery = useMemoFirebase(() => {
      if (!isAdmin) return null;
      return query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
  }, [isAdmin, user]);

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
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold">All Orders</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
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
    </div>
  );
}
