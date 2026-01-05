
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
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
        return query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('orderDate', 'desc'));
    }, [user, db]);

    const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const servicesQuery = useMemoFirebase(() => db ? collection(db, 'services') : null, [db]);
    const packagesQuery = useMemoFirebase(() => db ? collection(db, 'comboPackages') : null, [db]);
    const { data: services, isLoading: areServicesLoading } = useCollection<Service>(servicesQuery);
    const { data: packages, isLoading: arePackagesLoading } = useCollection<Package>(packagesQuery);
    
    const allServicesMap = useMemo(() => {
        const map = new Map<string, string>();
        if (services) services.forEach(s => map.set(s.id, s.name));
        if (packages) packages.forEach(p => map.set(p.id, p.name));
        return map;
    }, [services, packages]);

    const ordersWithServiceNames = useMemo(() => {
        if (!orders) return [];
        return orders.map(order => ({
            ...order,
            serviceName: allServicesMap.get(order.selectedServiceId) || 'Unknown Service',
        }));
    }, [orders, allServicesMap]);
    
    const isLoading = isUserLoading || areOrdersLoading || areServicesLoading || arePackagesLoading;

    const getStatusVariant = (status: Order['status'] | Order['paymentStatus']) => {
        switch (status) {
            case 'Pending': return 'destructive';
            case 'In Progress': return 'default';
            case 'Delivered': return 'secondary';
            case 'Advance': return 'secondary';
            case 'Paid': return 'default'; // Using 'default' which is green-ish in some themes
            default: return 'outline';
        }
    };

    const renderSkeleton = () => (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                 <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-4 bg-muted/50"><Skeleton className="h-5 w-3/4" /></CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-20 rounded-full" /></div>
                    </CardContent>
                </Card>
            ))}
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
                     !user ? (
                         <div className="text-center py-12">
                             <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                             <p className="text-muted-foreground mb-4">Please log in to view your orders.</p>
                             <Button asChild><Link href="/login">Login</Link></Button>
                         </div>
                     ) :
                     ordersWithServiceNames.length > 0 ? (
                        <div className="space-y-4">
                            {ordersWithServiceNames.map(order => (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardHeader className="p-4 bg-muted/50">
                                        <CardTitle className="text-base truncate">{order.serviceName}</CardTitle>
                                        <CardDescription>Order placed on {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex gap-2">
                                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                            <Badge variant={getStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                                        </div>
                                        <div className="text-lg font-bold">
                                            Total: ₹{order.totalPrice ? order.totalPrice.toLocaleString('en-IN') : 'N/A'}
                                        </div>
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
                     )}
                </CardContent>
            </Card>
        </div>
    )
}
