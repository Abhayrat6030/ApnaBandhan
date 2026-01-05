
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Order, Service, Package } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function OrderHistoryPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        // Secure query: Only fetch orders where userId matches the current user's UID.
        return query(
            collection(db, 'orders'), 
            where('userId', '==', user.uid),
            orderBy('orderDate', 'desc')
        );
    }, [user, db]);

    const servicesQuery = useMemoFirebase(() => db ? collection(db, 'services') : null, [db]);
    const packagesQuery = useMemoFirebase(() => db ? collection(db, 'comboPackages') : null, [db]);

    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
    const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
    const { data: packages, isLoading: arePackagesLoading } = useCollection<Package>(packagesQuery);

    const allServicesMap = useMemo(() => {
        const map = new Map<string, string>();
        if(services) services.forEach(s => map.set(s.id, s.name));
        if(packages) packages.forEach(p => map.set(p.id, p.name));
        return map;
    }, [services, packages]);

    const ordersWithServiceNames = useMemo(() => {
        if (!userOrders) return [];
        return userOrders.map(order => ({
        ...order,
        serviceName: allServicesMap.get(order.selectedServiceId) || 'Unknown Service',
        }));
    }, [userOrders, allServicesMap]);

    const isLoading = isUserLoading || areOrdersLoading || areServicesLoading || arePackagesLoading;

    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'In Progress': return 'default';
            case 'Delivered': return 'outline';
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
    }

    const renderSkeleton = () => (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
        </div>
    );
    
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Order History</CardTitle>
                    <CardDescription>Track the status and history of all your orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderSkeleton() : 
                     userOrders && userOrders.length > 0 ? (
                        <div className="space-y-4">
                            {ordersWithServiceNames.map(order => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg truncate">{order.serviceName}</CardTitle>
                                        <CardDescription>Order placed on: {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Badge variant={getStatusVariant(order.status)}>Status: {order.status}</Badge>
                                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>Payment: {order.paymentStatus}</Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                     ) : (
                        <div className="text-center py-12">
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                            <Button asChild><Link href="/services">Browse Services</Link></Button>
                        </div>
                     )
                    }
                </CardContent>
            </Card>
        </div>
    )
}
