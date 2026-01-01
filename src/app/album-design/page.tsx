
'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const albumServices = services.filter(s => s.category === 'album-design');

export default function AlbumDesignPage() {
  const [filter, setFilter] = useState('all');

  // Since there's only one album type for now, filtering isn't really necessary,
  // but this structure allows for easy expansion.
  const filteredServices = albumServices;

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

      {/* <div className="flex justify-center mb-12">
        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList>
             <TabsTrigger value="all">All Designs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
       {filteredServices.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No album designs found.</p>
        </div>
      )}
    </div>
  );
}
