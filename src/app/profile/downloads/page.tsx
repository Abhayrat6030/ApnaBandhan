
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { DownloadableProduct } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const iconMap = {
    Video: Film,
    Image: ImageIcon,
};

export default function DownloadsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const downloadsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'downloadableProducts');
    }, [user, firestore]);

    const { data: downloadableItems, isLoading: areDownloadsLoading } = useCollection<DownloadableProduct>(downloadsQuery);

    const isLoading = isUserLoading || areDownloadsLoading;

    const renderSkeleton = () => (
         <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-48" />
                           <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-28 rounded-full" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Downloads</CardTitle>
                    <CardDescription>Your completed and delivered files are available here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? renderSkeleton() : (
                        downloadableItems && downloadableItems.length > 0 ? (
                            <div className="space-y-3">
                                {downloadableItems.map(item => {
                                    const Icon = iconMap[item.type as keyof typeof iconMap] || Film;
                                    return (
                                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <Icon className="h-6 w-6 text-primary" />
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Delivered on: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" asChild>
                                                <Link href={item.downloadUrl} target="_blank">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </Link>
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                             <div className="text-center py-12">
                                <Download className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">You have no files available for download yet.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
