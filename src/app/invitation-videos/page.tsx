
'use client';

import { useState } from 'react';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const videoFilters = [
  { value: 'all', label: 'All Videos' },
  { value: 'save-the-date-video', label: 'Save The Date' },
  { value: 'wedding-invitation-video', label: 'Full Invitation' },
];

export default function InvitationVideosPage() {
  const db = useFirestore();
  const [filter, setFilter] = useState('all');

  const servicesQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'services'), where('category', '==', 'invitation-videos'));
    if (filter !== 'all') {
      // This is a simple client-side filter for demonstration as rules for complex queries can be tricky.
      // For a real app, you might create a composite index in Firestore.
    }
    return q;
  }, [db, filter]);

  const { data: videoServices, isLoading } = useCollection<Service>(servicesQuery);

  const filteredServices = filter === 'all' || !videoServices
    ? videoServices
    : videoServices.filter(service => service.id.includes(filter) || service.slug.includes(filter));


  return (
    <div className="container mx-auto px-4 py-16 md:py-24 overflow-hidden animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Wedding Invitation Videos
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
          Announce your special day with a stunning video that captures your story.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList>
            {videoFilters.map(f => (
                <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
            <p className="text-muted-foreground text-lg">No videos found for this category.</p>
        </div>
      )}
    </div>
  );
}
