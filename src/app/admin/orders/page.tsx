import { mockOrders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';

export default function AdminOrdersPage() {

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold">All Orders</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <OrderTable orders={mockOrders} />
    </div>
  );
}
