
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Gift, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import type { Notification as RewardNotification } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyRewardsPage() {
    const { user, isUserLoading } = useUser();
    
    const isLoading = isUserLoading;

    const renderSkeleton = () => (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg bg-secondary/30">
                    <Skeleton className="h-8 w-8" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="text-right">
                         <Skeleton className="h-4 w-12" />
                         <Skeleton className="h-5 w-24 mt-1" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">My Rewards</CardTitle>
                    <CardDescription>Your collection of exclusive discounts and offers from us.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderSkeleton() : (
                        <div className="text-center py-12">
                            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">You have no rewards yet. Keep an eye out for special offers!</p>
                            <Button asChild>
                                <Link href="/services">Browse Services</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
