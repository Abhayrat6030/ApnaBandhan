
import { mockOrders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, CheckCircle } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';

export default function AdminDashboardPage() {
  const recentOrders = mockOrders.slice(0, 5);
  const totalRevenue = mockOrders.filter(o => o.paymentStatus === 'Paid').reduce((sum, order) => {
      // Dummy price logic for dashboard
      if (order.selectedServiceId.includes('combo')) return sum + 5000;
      if (order.selectedServiceId.includes('video')) return sum + 2500;
      return sum + 1000;
  }, 0);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
    { title: 'Total Orders', value: mockOrders.length, icon: ShoppingBag },
    { title: 'Completed Orders', value: mockOrders.filter(o => o.status === 'Delivered').length, icon: CheckCircle },
    { title: 'New Clients this month', value: '12', icon: Users },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Recent Orders</h2>
        <OrderTable orders={recentOrders.map(o => ({...o, serviceName: o.selectedServiceId}))} />
      </div>
    </div>
  );
}
