'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const cardServices = services.filter(s => s.category === 'invitation-cards');

const cardFilters = [
  { value: 'all', label: 'All' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'festival', label: 'Festival' },
  { value: 'babyshower', label: 'Baby Shower' },
  { value: 'housewarming', label: 'Housewarming' },
];

const premiumSellers = cardServices.filter(s => s.isFeatured).slice(0, 5);

export default function InvitationCardsPage() {
  const [filter, setFilter] = useState('all');

  const filteredServices = filter === 'all'
    ? cardServices
    : cardServices.filter(service => 
        service.tags?.includes(filter)
    );

  return (
    <div className="bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <div className="text-center mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
                Invitation Cards
            </h1>
            <p className="mt-2 max-w-3xl mx-auto text-muted-foreground text-lg">
                Beautiful Invitation Cards for Every Occasion
            </p>
        </div>

        {/* Browse by Category */}
        <section className="mb-12">
            <h2 className="font-bold text-2xl tracking-tight mb-4">Browse by Category</h2>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="h-auto justify-start flex-wrap bg-transparent p-0">
                {cardFilters.map(f => (
                    <TabsTrigger 
                        key={f.value} 
                        value={f.value} 
                        className="m-1 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg bg-card hover:bg-muted"
                    >
                        {f.label}
                    </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        </section>

        {/* Premium Sellers */}
       {premiumSellers.length > 0 && <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl tracking-tight">Premium Sellers</h2>
              <Button variant="ghost" asChild>
                <Link href="#">
                  <ChevronRight className="h-6 w-6" />
                </Link>
              </Button>
          </div>
          <div className="relative flex items-center justify-center p-8 bg-card rounded-lg shadow-inner">
             <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md"
              >
                <CarouselContent>
                  {premiumSellers.map((service, index) => (
                    <CarouselItem key={service.id}>
                        <div className="p-1">
                           <Link href={`/services/${service.slug}`} className="block group">
                              <Image
                                src={service.samples[0].url}
                                alt={service.name}
                                width={400}
                                height={500}
                                className="rounded-xl shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={service.samples[0].imageHint}
                              />
                           </Link>
                        </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0" />
                <CarouselNext className="absolute right-0" />
              </Carousel>
          </div>
        </section>}

        {/* Top Rated */}
        <section>
          <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl tracking-tight">Top Rated on Our Store</h2>
               <Button variant="ghost" asChild>
                  <Link href="#">
                    <ChevronRight className="h-6 w-6" />
                  </Link>
               </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
           {filteredServices.length === 0 && (
            <div className="text-center col-span-full py-16">
                <p className="text-muted-foreground text-lg">No designs found for this category.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
