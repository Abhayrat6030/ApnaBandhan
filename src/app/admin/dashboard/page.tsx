
'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service as ServiceType, Package as PackageType } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const isAdmin = useMemo(() => user?.email === 'abhayrat603@gmail.com', [user]);

  // Queries are now dependent on isUserLoading being false and isAdmin being true.
  const allOrdersQuery = useMemoFirebase(() => {
    if (isUserLoading || !isAdmin || !db) return null;
    return collection(db, 'orders');
  }, [db, isAdmin, isUserLoading]);
  
  const recentOrdersQuery = useMemoFirebase(() => {
    if (isUserLoading || !isAdmin || !db) return null;
    return query(collection(db, 'orders'), orderBy('orderDate', 'desc'), limit(5));
  }, [db, isAdmin, isUserLoading]);
  
  const servicesQuery = useMemoFirebase(() => db ? collection(db, 'services') : null, [db]);
  const packagesQuery = useMemoFirebase(() => db ? collection(db, 'comboPackages') : null, [db]);

  const { data: allOrders, isLoading: areAllOrdersLoading } = useCollection<Order>(allOrdersQuery);
  const { data: recentOrders, isLoading: areRecentOrdersLoading } = useCollection<Order>(recentOrdersQuery);
  const { data: services, isLoading: areServicesLoading } = useCollection<ServiceType>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<PackageType>(packagesQuery);
  
  const allServicesAndPackages = useMemo(() => {
    const combined = new Map<string, {name: string, price: number}>();
    if (services) services.forEach(s => combined.set(s.id, {name: s.name, price: s.price}));
    if (packages) packages.forEach(p => {
      const price = parseFloat(p.price?.replace(/[^0-9.]/g, '')) || 0;
      combined.set(p.id, {name: p.name, price: price });
    });
    return combined;
  }, [services, packages]);

  const stats = useMemo(() => {
    if (isUserLoading || !isAdmin || !allOrders) {
      return [
        { title: 'Total Revenue', value: 'N/A', icon: DollarSign },
        { title: 'Total Orders', value: 'N/A', icon: ShoppingBag },
        { title: 'Completed Orders', value: 'N/A', icon: CheckCircle },
      ];
    }

    const totalRevenue = allOrders.reduce((acc, order) => {
        if (order.paymentStatus === 'Paid') {
            const serviceOrPackage = allServicesAndPackages.get(order.selectedServiceId);
            return acc + (serviceOrPackage?.price || 0);
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
  }, [allOrders, allServicesAndPackages, isUserLoading, isAdmin]);
  
  const recentOrdersWithServiceNames = useMemo(() => {
    if (!recentOrders) return [];
    return recentOrders.map(order => ({
      ...order,
      serviceName: allServicesAndPackages.get(order.selectedServiceId)?.name || 'Unknown Service',
    }));
  }, [recentOrders, allServicesAndPackages]);

  const isLoading = isUserLoading || (isAdmin && (areAllOrdersLoading || areRecentOrdersLoading)) || areServicesLoading || arePackagesLoading;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <h1 className="font-headline text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        <h2 className="font-headline text-xl md:text-2xl font-bold mb-4">
          Recent Orders
        </h2>
        <Card>
          <CardContent className="p-0">
            {isLoading ? <div className="p-4"><Skeleton className="h-40 w-full" /></div> :
             !isAdmin && !isUserLoading ? <div className="p-6 text-center text-destructive-foreground bg-destructive"><p>You do not have permission to view orders.</p></div> :
             recentOrdersWithServiceNames && recentOrdersWithServiceNames.length > 0 ? <OrderTable orders={recentOrdersWithServiceNames} /> : 
             <div className="p-6 text-center text-muted-foreground"><p>No recent orders found.</p></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
