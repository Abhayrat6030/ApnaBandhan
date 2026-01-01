
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReferAndEarnPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const userProfileQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileQuery);
    
    const isLoading = isUserLoading || isProfileLoading;

    const referralCode = userProfile?.referralCode || '...';
    const referralLink = `https://apnabandhan.com/refer?code=${referralCode}`;

    const copyToClipboard = (text: string, type: string) => {
        if (isLoading || text === '...') return;
        navigator.clipboard.writeText(text);
        toast({
            title: `${type} Copied!`,
            description: `The ${type.toLowerCase()} has been copied to your clipboard.`,
        })
    }
    
    const renderSkeleton = () => (
         <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Refer & Earn</CardTitle>
                <CardDescription>Share ApnaBandhan with your friends and earn rewards!</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Skeleton className="h-6 w-full max-w-md mx-auto mb-4" />
                <div className="p-4 bg-muted rounded-lg flex items-center justify-center gap-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-9 w-9" />
                </div>
                <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
        </Card>
    )

    if (isLoading) {
        return <div className="container mx-auto px-4 py-8 md:py-16">{renderSkeleton()}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-2xl">Refer & Earn</CardTitle>
                    <CardDescription>Share ApnaBandhan with your friends and earn rewards!</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">Share your unique referral code with your friends. When they place their first order, you both get a 20% discount!</p>
                    <div className="p-4 bg-muted rounded-lg flex items-center justify-center gap-4">
                        {isLoading ? <Loader2 className="animate-spin" /> : <span className="text-2xl font-bold tracking-widest">{referralCode}</span>}
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(referralCode, 'Referral Code')}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button className="mt-6 w-full" onClick={() => copyToClipboard(referralLink, 'Referral Link')} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Copy Referral Link'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
