'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ChevronRight, Star } from 'lucide-react';
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

// Expanded categories based on the design
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
const topRated = [...cardServices].sort(() => 0.5 - Math.random()).slice(0, 8); // Randomize for demo

export default function InvitationCardsPage() {
  const [filter, setFilter] = useState('all');

  const filteredServices = filter === 'all'
    ? cardServices
    : cardServices.filter(service => service.slug.includes(filter));

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        {/* Browse by Category */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Browse by Category</h2>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="flex-wrap h-auto justify-start">
                {cardFilters.map(f => (
                    <TabsTrigger key={f.value} value={f.value} className="m-1">{f.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        </section>

        {/* Premium Sellers */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Premium Sellers</h2>
              <Button variant="ghost">
                  <ChevronRight className="h-6 w-6" />
              </Button>
          </div>
          <div className="relative flex items-center justify-center p-8 bg-secondary/30 rounded-lg">
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
        </section>

        {/* Top Rated */}
        <section>
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Top Rated on Our Store</h2>
               <Button variant="ghost">
                  <ChevronRight className="h-6 w-6" />
              </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {topRated.map(service => (
              <Link key={service.id} href={`/services/${service.slug}`} className="group">
                <div className="border rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={service.samples[0]?.url || 'https://picsum.photos/seed/placeholder/300/400'}
                      alt={service.name}
                      fill
                      className="object-cover"
                      data-ai-hint={service.samples[0]?.imageHint || 'invitation card'}
                    />
                     {service.isFeatured && <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Premium</div>}
                  </div>
                  <div className="p-3 bg-card">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary">{service.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-bold text-base text-primary">₹{service.price}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
                        <span className="font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
