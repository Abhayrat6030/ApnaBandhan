
import { Suspense } from 'react';
import { getAllServicesAndPackages } from '@/app/actions/admin';
import AdminServicesPageClient from './AdminServicesPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

async function ServicesList() {
    const allItems = await getAllServicesAndPackages();
    return <AdminServicesPageClient allItems={allItems} />;
}

function ServicesSkeleton() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
            <div className="flex items-center">
                <Skeleton className="h-8 w-48" />
                <div className="ml-auto">
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-7 w-64" /></CardTitle>
                    <CardDescription><Skeleton className="h-5 w-96" /></CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                     <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-4 w-32" />
                </CardFooter>
            </Card>
        </main>
    )
}

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<ServicesSkeleton />}>
      <ServicesList />
    </Suspense>
  );
}
