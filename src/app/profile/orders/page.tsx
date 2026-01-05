
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
import type { Order, Service, Package } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function OrderHistoryPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('orderDate', 'desc'));
    }, [user, db]);

    const servicesQuery = useMemoFirebase(() => db ? collection(db, 'services') : null, [db]);
    const packagesQuery = useMemoFirebase(() => db ? collection(db, 'comboPackages') : null, [db]);

    const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
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
      <>
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
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
                    {isLoading ? renderSkeleton() : 
                    ordersWithServiceNames && ordersWithServiceNames.length > 0 ? (
                      <>
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {ordersWithServiceNames.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium max-w-[250px] truncate">{order.serviceName}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
                                        <TableCell><Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge></TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {ordersWithServiceNames.map(order => (
                                <Card key={order.id}>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-base truncate">{order.serviceName}</CardTitle>
                                        <CardDescription>Ordered: {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="p-4 pt-2 flex gap-2">
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                      </>
                    ) : (
                        <div className="text-center py-12">
                             <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                            <Button asChild>
                                <Link href="/services">Browse Services</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
