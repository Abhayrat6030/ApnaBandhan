
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, MessageSquare, Loader2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface OrderTableProps {
  orders: (Order & { serviceName?: string })[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);

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
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    if (!db) return;
    setIsSubmitting(`status-${orderId}`);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast({ title: "Status Updated", description: `Order ${orderId} marked as ${newStatus}`});
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: 'destructive'});
    }
    setIsSubmitting(null);
  }

  const handlePaymentUpdate = async (orderId: string, newStatus: Order['paymentStatus']) => {
    if (!db) return;
    setIsSubmitting(`payment-${orderId}`);
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { paymentStatus: newStatus });
        toast({ title: "Payment Status Updated", description: `Order ${orderId} marked as ${newStatus}`});
    } catch (error: any) {
        toast({ title: "Update Failed", description: error.message, variant: 'destructive'});
    }
    setIsSubmitting(null);
  }
  
  const isUpdating = (type: 'status' | 'payment', orderId: string) => {
      return isSubmitting === `${type}-${orderId}`;
  }

  return (
    <div className="relative w-full overflow-auto">
        {/* Desktop Table */}
        <div className="hidden md:block">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">
                    <div className="font-semibold">{order.fullName}</div>
                    <div className="text-sm text-muted-foreground">{order.phoneNumber}</div>
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">{order.serviceName || order.selectedServiceId}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString('en-CA')}</TableCell>
                    <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!isSubmitting}>
                            {isSubmitting?.endsWith(order.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`https://wa.me/${order.phoneNumber.replace('+', '')}`} target="_blank">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Reply on WhatsApp
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger disabled={isUpdating('status', order.id)}>
                            <span>Change Status</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Pending')} disabled={order.status === 'Pending'}>Pending</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'In Progress')} disabled={order.status === 'In Progress'}>In Progress</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Delivered')} disabled={order.status === 'Delivered'}>Delivered</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger disabled={isUpdating('payment', order.id)}>
                                <span>Update Payment</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Pending')} disabled={order.paymentStatus === 'Pending'}>Pending</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Advance')} disabled={order.paymentStatus === 'Advance'}>Advance</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Paid')} disabled={order.paymentStatus === 'Paid'}>Paid</DropdownMenuItem>
                            </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden p-4 space-y-4">
            {orders.map(order => (
                 <Card key={order.id} className="w-full">
                    <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                        <div>
                            <CardTitle className="text-base">{order.fullName}</CardTitle>
                            <CardDescription>{order.phoneNumber}</CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!isSubmitting} className="-mt-2 -mr-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {/* Actions can be simplified for mobile if needed */}
                                <DropdownMenuItem asChild><Link href={`https://wa.me/${order.phoneNumber.replace('+', '')}`} target="_blank"><MessageSquare className="mr-2 h-4 w-4" />WhatsApp</Link></DropdownMenuItem>
                                <DropdownMenuSub><DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>{/* ... */}</DropdownMenuSub>
                                <DropdownMenuSub><DropdownMenuSubTrigger>Update Payment</DropdownMenuSubTrigger>{/* ... */}</DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground truncate">{order.serviceName || order.selectedServiceId}</p>
                        <p className="text-xs text-muted-foreground">Ordered: {new Date(order.orderDate).toLocaleDateString('en-CA')}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
