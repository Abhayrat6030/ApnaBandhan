
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllOrders } from '@/app/actions/admin';

async function OrdersList() {
    const allOrders = await getAllOrders();
    return (
        <Card>
            <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>A list of all the orders from your customers.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
            {allOrders && allOrders.length > 0 ? (
                <OrderTable orders={allOrders} />
            ) : (
                <div className="p-6 text-center text-muted-foreground">
                <p>No orders found.</p>
                </div>
            )}
            </CardContent>
        </Card>
    );
}

function OrdersSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>A list of all the orders from your customers.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}


export default function AdminOrdersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">All Orders</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                </span>
            </Button>
        </div>
      </div>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList />
      </Suspense>
    </main>
  );
}
