
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditCard, Landmark } from 'lucide-react';

export default function PaymentsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Payments</CardTitle>
                    <CardDescription>Manage your payment methods and view transaction history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                         <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">This feature is coming soon. You'll be able to save payment methods and see your transaction history here.</p>
                        <Button asChild>
                            <Link href="/order">Place a New Order</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
