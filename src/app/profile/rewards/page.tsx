
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const rewards = [
    {
        id: 1,
        title: "10% Off Next Order",
        description: "Valid on any service or package. Expires in 30 days.",
        code: "WELCOME10"
    }
]

export default function MyRewardsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">My Rewards</CardTitle>
                    <CardDescription>Your collection of exclusive discounts and offers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rewards.map(reward => (
                            <div key={reward.id} className="flex items-center gap-4 p-4 border rounded-lg bg-secondary/30">
                                <Ticket className="h-8 w-8 text-primary" />
                                <div className="flex-1">
                                    <p className="font-bold">{reward.title}</p>
                                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Code</p>
                                    <p className="font-mono font-semibold">{reward.code}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                     {rewards.length === 0 && (
                        <div className="text-center py-12">
                             <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">You have no rewards yet. Complete an order or refer a friend to earn some!</p>
                            <Button asChild>
                                <Link href="/services">Browse Services</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
