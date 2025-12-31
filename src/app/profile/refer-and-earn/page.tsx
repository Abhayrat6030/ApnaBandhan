
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Copy } from 'lucide-react';

export default function ReferAndEarnPage() {
    const referralCode = "ROHAN25";
    const referralLink = `https://apnabandhan.com/refer?code=${referralCode}`;

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
                        <span className="text-2xl font-bold tracking-widest">{referralCode}</span>
                        <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(referralCode)}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button className="mt-6 w-full" onClick={() => navigator.clipboard.writeText(referralLink)}>
                        Copy Referral Link
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
