
'use client';

import { useState } from 'react';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlbumDesignPage() {
  const db = useFirestore();
  const [filter, setFilter] = useState('all');

  const servicesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'services'), where('category', '==', 'album-design'));
  }, [db]);

  const { data: albumServices, isLoading } = useCollection<Service>(servicesQuery);

  const filteredServices = albumServices; // Filtering logic can be expanded if needed

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 overflow-hidden animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Wedding Album Designs
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
          A timeless treasure to cherish your most precious moments.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredServices && filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

       {(!isLoading && (!filteredServices || filteredServices.length === 0)) && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No album designs found.</p>
        </div>
      )}
    </div>
  );
}
