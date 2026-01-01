
'use client';

import { useMemo } from 'react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service as ServiceType, Package as PackageType } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { services as staticServices, packages as staticPackages } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const db = useFirestore();

  const allOrdersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'orders');
  }, [db]);
  
  const recentOrdersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('orderDate', 'desc'), limit(5));
  }, [db]);

  const { data: allOrders, isLoading: areAllOrdersLoading } = useCollection<Order>(allOrdersQuery);
  const { data: recentOrders, isLoading: areRecentOrdersLoading } = useCollection<Order>(recentOrdersQuery);
  
  const allServicesAndPackages = useMemo(() => {
    const combined: (ServiceType | PackageType)[] = [...staticServices, ...staticPackages];
    return new Map(combined.map(item => [item.id, item.name]));
  }, []);

  const stats = useMemo(() => {
    if (!allOrders) {
      return [
        { title: 'Total Revenue', value: 'N/A', icon: DollarSign },
        { title: 'Total Orders', value: 'N/A', icon: ShoppingBag },
        { title: 'Completed Orders', value: 'N/A', icon: CheckCircle },
      ];
    }
    const totalRevenue = allOrders.reduce((acc, order) => {
        const serviceOrPackage = [...staticServices, ...staticPackages].find(item => item.id === order.selectedServiceId);
        if (order.paymentStatus === 'Paid' && serviceOrPackage) {
            let price = 0;
            if ('price' in serviceOrPackage && typeof serviceOrPackage.price === 'number') {
                price = serviceOrPackage.price;
            } else if ('price' in serviceOrPackage && typeof serviceOrPackage.price === 'string') {
                price = parseFloat(serviceOrPackage.price.replace(/[^0-9.-]+/g,""));
            }
            return acc + price;
        }
        return acc;
    }, 0);

    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(o => o.status === 'Delivered').length;

     return [
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
        { title: 'Total Orders', value: totalOrders, icon: ShoppingBag },
        { title: 'Completed Orders', value: completedOrders, icon: CheckCircle },
      ];
  }, [allOrders]);
  
  const recentOrdersWithServiceNames = useMemo(() => {
    if (!recentOrders) return [];
    return recentOrders.map(order => ({
      ...order,
      serviceName: allServicesAndPackages.get(order.selectedServiceId) || 'Unknown Service',
    }));
  }, [recentOrders, allServicesAndPackages]);

  const isLoading = areAllOrdersLoading || areRecentOrdersLoading;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stat.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">
          Recent Orders
        </h2>
        <Card>
          <CardContent className="p-0">
            {isLoading ? <div className="p-4"><Skeleton className="h-20 w-full" /></div> :
             recentOrdersWithServiceNames && recentOrdersWithServiceNames.length > 0 ? <OrderTable orders={recentOrdersWithServiceNames} /> : 
             <div className="p-6 text-center text-muted-foreground"><p>No recent orders found.</p></div>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
