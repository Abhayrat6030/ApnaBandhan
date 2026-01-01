
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAdminDashboardData } from '@/app/actions/admin';
import OrderTable from '@/components/admin/OrderTable';

async function Stats() {
  const { stats, recentOrders } = await getAdminDashboardData();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">
          Recent Orders
        </h2>
        <Card>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
                <OrderTable orders={recentOrders} />
            ) : (
                <div className="p-6 text-center text-muted-foreground"><p>No recent orders found.</p></div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatsSkeleton() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
             <div>
                <h2 className="font-headline text-2xl font-bold mb-4">
                Recent Orders
                </h2>
                <Card>
                <CardContent className="p-4">
                    <Skeleton className="h-40 w-full" />
                </CardContent>
                </Card>
            </div>
        </>
    )
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
    </div>
  );
}
