
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, FileText } from 'lucide-react';
import Link from 'next/link';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function OrderHistoryPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || isUserLoading || !db) return null;
        // Secure query: Only fetch orders where userId matches the current user's UID.
        return query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('orderDate', 'desc')
        );
    }, [user, isUserLoading, db]);

    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

    const isLoading = isUserLoading || areOrdersLoading;

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
    
    const renderOrderDate = (orderDate: any) => {
        if (!orderDate) return 'N/A';
        if (orderDate instanceof Timestamp) {
            return orderDate.toDate().toLocaleDateString();
        }
        return new Date(orderDate).toLocaleDateString();
    };


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
                            {userOrders.map(order => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg truncate">{order.selectedServiceId.startsWith('Custom:') ? 'Custom Requirement' : order.selectedServiceId}</CardTitle>
                                        {order.selectedServiceId.startsWith('Custom:') && (
                                            <CardDescription className="flex items-start gap-2 pt-1">
                                                <FileText className="h-4 w-4 mt-1 shrink-0" /> 
                                                <span>{order.selectedServiceId.replace('Custom: ', '')}</span>
                                            </CardDescription>
                                        )}
                                        <CardDescription>Order placed on: {renderOrderDate(order.orderDate)}</CardDescription>
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
