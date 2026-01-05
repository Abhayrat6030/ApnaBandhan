
'use client';

import { ServiceCard } from '@/components/shared/ServiceCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function VideoEditingPage() {
  const db = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'services'), where('category', '==', 'video-editing'));
  }, [db]);

  const { data: videoEditingServices, isLoading } = useCollection<Service>(servicesQuery);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 overflow-hidden animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Wedding Video Editing
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
          Transform your raw footage into a cinematic wedding film.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {videoEditingServices && videoEditingServices.map(service => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      )}

       {(!isLoading && (!videoEditingServices || videoEditingServices.length === 0)) && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No video editing services found.</p>
        </div>
      )}
    </div>
  );
}
