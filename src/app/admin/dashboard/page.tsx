
'use client';

import { useMemo } from 'react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const stats = [
    { title: 'Total Revenue', value: 'N/A', icon: DollarSign },
    { title: 'Total Orders', value: 'N/A', icon: ShoppingBag },
    { title: 'Completed Orders', value: 'N/A', icon: CheckCircle },
    { title: 'New Clients this month', value: 'N/A', icon: Users },
  ];

  if (isUserLoading) {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
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
        <h2 className="font-headline text-2xl font-bold mb-4">
          Recent Orders
        </h2>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Recent orders are temporarily disabled to ensure stability.</p>
            <p>Please use the 'Orders' page to view all orders.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
