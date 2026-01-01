
'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';

const videoEditingServices = services.filter(s => s.category === 'video-editing');

export default function VideoEditingPage() {

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Wedding Video Editing
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
          Transform your raw footage into a cinematic wedding film.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {videoEditingServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
       {videoEditingServices.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No video editing services found.</p>
        </div>
      )}
    </div>
  );
}
