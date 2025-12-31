'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service } from '@/lib/types';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'orders');
  }, [firestore, user]);
  
  const recentOrdersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'), limit(5));
  }, [firestore, user]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'services');
  }, [firestore]);

  const packagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'comboPackages');
  }, [firestore]);

  const { data: allOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
  const { data: recentOrders, isLoading: areRecentOrdersLoading } = useCollection<Order>(recentOrdersQuery);
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
  const { data: packages, isLoading: arePackagesLoading } = useCollection<any>(packagesQuery);
  
  const serviceAndPackageMap = useMemo(() => {
    const map = new Map<string, { name: string; price: number }>();
    if (services) {
      services.forEach(s => map.set(s.id, { name: s.name, price: s.price }));
    }
    if (packages) {
      packages.forEach(p => map.set(p.id, { name: p.name, price: Number(p.price.toString().replace(/[^0-9.-]+/g,"")) }));
    }
    return map;
  }, [services, packages]);

  const totalRevenue = useMemo(() => {
    if (!allOrders) return 0;
    return allOrders.filter(o => o.paymentStatus === 'Paid').reduce((sum, order) => {
      const service = serviceAndPackageMap.get(order.selectedServiceId);
      return sum + (service?.price || 0);
    }, 0);
  }, [allOrders, serviceAndPackageMap]);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
    { title: 'Total Orders', value: allOrders?.length ?? 0, icon: ShoppingBag },
    { title: 'Completed Orders', value: allOrders?.filter(o => o.status === 'Delivered').length ?? 0, icon: CheckCircle },
    { title: 'New Clients this month', value: '12', icon: Users }, // This remains mock for now
  ];
  
  const recentOrdersWithServiceNames = useMemo(() => {
    if (!recentOrders) return [];
    return recentOrders.map(order => ({
      ...order,
      serviceName: serviceAndPackageMap.get(order.selectedServiceId)?.name || order.selectedServiceId,
    }));
  }, [recentOrders, serviceAndPackageMap]);
  
  const isLoading = isUserLoading || areOrdersLoading || areRecentOrdersLoading || areServicesLoading || arePackagesLoading;

  if (isLoading) {
    return (
       <div className="p-4 md:p-8">
        <h1 className="font-headline text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="font-headline text-2xl font-bold mb-4">Recent Orders</h2>
          <Card>
            <CardContent className="p-0">
               <div className="space-y-4 p-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Recent Orders</h2>
        <OrderTable orders={recentOrdersWithServiceNames} />
      </div>
    </div>
  );
}
