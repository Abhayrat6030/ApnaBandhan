
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function AdminReferralsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
            <div className="flex items-center">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">Referral Program</h1>
            </div>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Refer & Earn Management</CardTitle>
                    <CardDescription>View referral statistics and manage the program.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-center py-12">
                        <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">This feature is under development.</p>
                        <p className="text-sm text-muted-foreground">Statistics and management tools for the referral program will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
