
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, CheckCircle, Gift, Loader2 } from 'lucide-react';
import { useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap = {
    order: CheckCircle,
    offer: Gift,
    general: Bell,
};

export default function NotificationsPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();

    const notificationsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(
            collection(db, 'users', user.uid, 'notifications'), 
            where('type', 'in', ['general', 'order']),
            orderBy('date', 'desc')
        );
    }, [user, db]);

    const { data: notifications, isLoading: areNotificationsLoading } = useCollection<Notification>(notificationsQuery);
    
    const isLoading = isUserLoading || areNotificationsLoading;

    const renderSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg">
                    <Skeleton className="h-5 w-5 rounded-full mt-1" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Notifications</CardTitle>
                    <CardDescription>Stay updated with your orders and general announcements.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderSkeleton() : (
                        notifications && notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map(notification => {
                                    const Icon = iconMap[notification.type as keyof typeof iconMap] || Bell;
                                    return (
                                        <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg ${!notification.read ? 'bg-secondary/50' : 'bg-transparent'}`}>
                                            <div className={`mt-1 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleDateString()}</p>
                                            </div>
                                            {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">You have no new notifications.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
