
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service as ServiceType, Package as PackageType } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { services as staticServices, packages as staticPackages } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  const db = useFirestore();
  const { user } = useUser();
  const isAdmin = user?.email === 'abhayrat603@gmail.com';

  const stats = [
    { title: 'Total Revenue', value: 'N/A', icon: DollarSign },
    { title: 'Total Orders', value: 'N/A', icon: ShoppingBag },
    { title: 'Completed Orders', value: 'N/A', icon: CheckCircle },
  ];

  const isLoading = !user;

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
             !isAdmin ? <div className="p-6 text-center text-destructive-foreground bg-destructive"><p>You do not have permission to view orders.</p></div> :
             <div className="p-6 text-center text-muted-foreground"><p>Recent orders are currently unavailable.</p></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
