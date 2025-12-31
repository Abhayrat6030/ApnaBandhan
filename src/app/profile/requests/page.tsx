
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function MyRequestsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="text-2xl">My Requests</CardTitle>
                    <CardDescription>This page will show your special requests and inquiries.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">This feature is coming soon! Any special requests made through the contact form will be displayed here.</p>
                    <Button asChild>
                        <Link href="/contact">Make a Request</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
