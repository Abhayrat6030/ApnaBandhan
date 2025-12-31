
'use client';

import { useMemo } from 'react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service as ServiceType } from '@/lib/types';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { useCollection, useMemoFirebase, db } from '@/firebase';
import { services as staticServices, packages as staticPackages } from '@/lib/data';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const allOrdersQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return collection(db, 'orders');
  }, [isAdmin]);
  
  const recentOrdersQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return query(collection(db, 'orders'), orderBy('orderDate', 'desc'), limit(5));
  }, [isAdmin]);

  const { data: allOrders, isLoading: areAllOrdersLoading } = useCollection<Order>(allOrdersQuery);
  const { data: recentOrders, isLoading: areRecentOrdersLoading } = useCollection<Order>(recentOrdersQuery);
  
  const allServicesAndPackages = useMemo(() => [...staticServices, ...staticPackages], []);

  const stats = useMemo(() => {
    if (!allOrders) {
      return [
        { title: 'Total Revenue', value: 'N/A', icon: DollarSign },
        { title: 'Total Orders', value: 'N/A', icon: ShoppingBag },
        { title: 'Completed Orders', value: 'N/A', icon: CheckCircle },
      ];
    }
    const totalRevenue = allOrders.reduce((acc, order) => {
        const service = allServicesAndPackages.find(s => s.id === order.selectedServiceId);
        if (order.paymentStatus === 'Paid' && service) {
            let price = 0;
            // The price can be a number (for Service) or a string (for Package)
            const servicePrice = (service as any).price;
            if (typeof servicePrice === 'number') {
                price = servicePrice;
            } else if (typeof servicePrice === 'string') {
                price = parseFloat(servicePrice.replace(/[^0-9.-]+/g,""));
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
  }, [allOrders, allServicesAndPackages]);
  
  const isLoading = isUserLoading || areAllOrdersLoading || areRecentOrdersLoading;

  if (isUserLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="font-headline text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
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
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-8 text-center">
        <h1 className="font-headline text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading && stat.value === 'N/A' ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stat.value}</div>}
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
            {isLoading && !recentOrders ? <div className="p-4"><Skeleton className="h-20 w-full" /></div> :
             recentOrders && recentOrders.length > 0 ? <OrderTable orders={recentOrders} /> : 
             <div className="p-6 text-center text-muted-foreground"><p>No recent orders found.</p></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
