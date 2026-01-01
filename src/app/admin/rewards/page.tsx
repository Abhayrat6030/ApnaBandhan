
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award } from 'lucide-react';

export default function AdminRewardsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
            <div className="flex items-center">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Rewards</h1>
            </div>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>User Rewards</CardTitle>
                    <CardDescription>Manage user rewards, discounts, and coupons.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-center py-12">
                        <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">This feature is under development.</p>
                        <p className="text-sm text-muted-foreground">You will be able to add, edit, and view user rewards here.</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
