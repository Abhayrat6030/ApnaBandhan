
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Service } from '@/lib/types';
import { services as staticServices } from '@/lib/data';

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
    const firestore = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
    }, [user, firestore]);

    const servicesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'services');
    }, [firestore]);

    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
    const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);

    const allServicesMap = useMemo(() => {
        const map = new Map<string, string>();
        // Combine static and firestore services for full lookup capability
        staticServices.forEach(s => map.set(s.id, s.name));
        services?.forEach(s => map.set(s.id, s.name));
        return map;
    }, [services]);

    const isLoading = isUserLoading || areOrdersLoading || areServicesLoading;

    const renderSkeleton = () => (
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
