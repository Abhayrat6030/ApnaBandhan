
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, MessageSquare, Loader2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { updateOrderStatus, updatePaymentStatus } from '@/app/actions/admin';

interface OrderTableProps {
  orders: (Order & { serviceName?: string })[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

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

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(`status-${orderId}`);
    startTransition(async () => {
        try {
            await updateOrderStatus({ orderId, newStatus });
            toast({ title: "Status Updated", description: `Order ${orderId} marked as ${newStatus}`});
            router.refresh();
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: 'destructive'});
        } finally {
            setUpdatingId(null);
        }
    });
  }

  const handlePaymentUpdate = (orderId: string, newStatus: Order['paymentStatus']) => {
    setUpdatingId(`payment-${orderId}`);
    startTransition(async () => {
        try {
            await updatePaymentStatus({ orderId, newStatus });
            toast({ title: "Payment Status Updated", description: `Order ${orderId} marked as ${newStatus}`});
            router.refresh();
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: 'destructive'});
        } finally {
            setUpdatingId(null);
        }
    });
  }
  
  const isUpdating = (type: 'status' | 'payment', orderId: string) => {
      return isPending && updatingId === `${type}-${orderId}`;
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
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            {isPending && updatingId?.endsWith(order.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
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
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Pending')} disabled={order.status === 'Pending' || isUpdating('status', order.id)}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'In Progress')} disabled={order.status === 'In Progress' || isUpdating('status', order.id)}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Delivered')} disabled={order.status === 'Delivered' || isUpdating('status', order.id)}>Delivered</DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Payment</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Pending')} disabled={order.paymentStatus === 'Pending' || isUpdating('payment', order.id)}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Advance')} disabled={order.paymentStatus === 'Advance' || isUpdating('payment', order.id)}>Advance</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Paid')} disabled={order.paymentStatus === 'Paid' || isUpdating('payment', order.id)}>Paid</DropdownMenuItem>

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
                            <CardTitle className="text-base truncate">{order.fullName}</CardTitle>
                            <CardDescription>{order.phoneNumber}</CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending} className="-mt-2 -mr-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link href={`https://wa.me/${order.phoneNumber.replace('+', '')}`} target="_blank"><MessageSquare className="mr-2 h-4 w-4" />WhatsApp</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Pending')} disabled={order.status === 'Pending' || isUpdating('status', order.id)}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'In Progress')} disabled={order.status === 'In Progress' || isUpdating('status', order.id)}>In Progress</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Delivered')} disabled={order.status === 'Delivered' || isUpdating('status', order.id)}>Delivered</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Update Payment</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Pending')} disabled={order.paymentStatus === 'Pending' || isUpdating('payment', order.id)}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Advance')} disabled={order.paymentStatus === 'Advance' || isUpdating('payment', order.id)}>Advance</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePaymentUpdate(order.id, 'Paid')} disabled={order.paymentStatus === 'Paid' || isUpdating('payment', order.id)}>Paid</DropdownMenuItem>
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
