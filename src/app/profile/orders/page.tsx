
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import { packages, services as staticServices } from '@/lib/data';

export const dynamic = 'force-dynamic';

const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'In Progress': return 'default';
      case 'Delivered': return 'outline';
      case 'Paid': return 'default';
      default: return 'secondary';
    }
};

const getPaymentStatusVariant = (status: Order['paymentStatus']) => {
    switch (status) {
        case 'Pending': return 'destructive';
        case 'Advance': return 'secondary';
        case 'Paid': return 'default';
        default: return 'secondary';
    }
};

export default function OrderHistoryPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !db || user.isAnonymous) {
          return null;
        }
        // This is the secure query that works with the updated Firestore rules
        return query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('orderDate', 'desc'));
    }, [user, db]);

    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const allServicesMap = useMemo(() => {
        const map = new Map<string, string>();
        staticServices.forEach(s => map.set(s.id, s.name));
        packages.forEach(p => map.set(p.id, p.name));
        return map;
    }, []);

    const isLoading = isUserLoading || areOrdersLoading;

    const renderSkeleton = () => (
      <>
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-4">
             {[...Array(3)].map((_, i) => (
                <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
        </div>
      </>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Order History</CardTitle>
                    <CardDescription>Track the status and history of all your orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderSkeleton() : (
                        userOrders && userOrders.length > 0 ? (
                           <>
                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Payment</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium truncate" style={{maxWidth: 100}}>{order.id}</TableCell>
                                                <TableCell>{allServicesMap.get(order.selectedServiceId) || order.selectedServiceId}</TableCell>
                                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </div>
                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-4">
                                     {userOrders.map((order) => (
                                        <Card key={order.id}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base truncate">{allServicesMap.get(order.selectedServiceId) || order.selectedServiceId}</CardTitle>
                                                <CardDescription>Order: #{order.id.substring(0, 7)}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="text-sm">
                                                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                            </CardContent>
                                            <CardFooter className="flex gap-2">
                                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                           </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                                <Button asChild>
                                    <Link href="/services">Browse Services</Link>
                                </Button>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
