'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';


export default function AdminOrdersPage() {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'orders');
  }, [firestore]);

  const servicesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'services');
  }, [firestore]);

  const packagesQuery = useMemoFirebase(() => {
      if(!firestore) return null;
      return collection(firestore, 'comboPackages');
  }, [firestore]);

  const { data: allOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<Service>(packagesQuery);
  
  const allServicesMap = useMemo(() => {
    const map = new Map<string, string>();
    if (services) {
        services.forEach(s => map.set(s.id, s.name));
    }
    if (packages) {
        packages.forEach(p => map.set(p.id, p.name));
    }
    return map;
  }, [services, packages]);

  const ordersWithServiceNames = useMemo(() => {
    if (!allOrders) return [];
    return allOrders.map(order => ({
      ...order,
      serviceName: allServicesMap.get(order.selectedServiceId) || order.selectedServiceId,
    }));
  }, [allOrders, allServicesMap]);
  
  const isLoading = areOrdersLoading || areServicesLoading || arePackagesLoading;

  const renderSkeleton = () => (
    <div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
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
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? renderSkeleton() : (
            allOrders ? <OrderTable orders={ordersWithServiceNames} /> : <p className="p-6">No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
