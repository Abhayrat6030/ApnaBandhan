'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';


export default function AdminOrdersPage() {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'orders');
  }, [firestore]);

  const { data: allOrders, isLoading } = useCollection<Order>(ordersQuery);

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

      {isLoading ? renderSkeleton() : (
        allOrders ? <OrderTable orders={allOrders} /> : <p>No orders found.</p>
      )}
    </div>
  );
}
