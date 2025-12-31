
'use client';

import { mockOrders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Filter mock orders to simulate a specific user's orders
const userOrders = mockOrders.filter(o => o.clientName === 'Rohan Sharma' || o.clientName === 'Priya Patel');

const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'In Progress': return 'default';
      case 'Delivered': return 'outline';
      case 'Paid': return 'default';
      default: return 'secondary';
    }
};

export default function OrderHistoryPage() {

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Order History</CardTitle>
                    <CardDescription>Track the status and history of all your orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userOrders.length > 0 ? (
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
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.service}</TableCell>
                                    <TableCell>{order.orderDate.toString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{order.paymentStatus}</Badge>
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
