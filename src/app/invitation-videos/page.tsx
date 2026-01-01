
'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const videoServices = services.filter(s => s.category === 'invitation-videos');
const videoFilters = [
  { value: 'all', label: 'All Videos' },
  { value: 'save-the-date-video', label: 'Save The Date' },
  { value: 'wedding-invitation-video', label: 'Full Invitation' },
];

export default function InvitationVideosPage() {
  const [filter, setFilter] = useState('all');

  const filteredServices = filter === 'all'
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
       {filteredServices.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No videos found for this category.</p>
        </div>
      )}
    </div>
  );
}
