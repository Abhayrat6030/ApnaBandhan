'use client';

import { useState, useEffect } from 'react';
import { services } from '@/lib/data';
import { Service } from '@/lib/types';
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
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/shared/ProductCard';

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
const topRatedServices = cardServices.filter(s => s.topRated).slice(0,4);


// New component for the new card design
function InvitationProductCard({ service }: { service: Service }) {
  const discount = service.originalPrice && service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;
  
  const primaryImage = service.samples.find(s => s.type === 'image');

  return (
    <Link href={`/services/${service.slug}`} className="group block">
      <Card className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
        <CardContent className="p-0 relative">
          {primaryImage && (
            <div className="relative aspect-[3/4] w-full bg-muted/30 rounded-t-2xl">
              <Image 
                src={primaryImage.url}
                alt={service.name}
                fill
                className="object-contain"
                data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
              />
            </div>
          )}
          {discount > 0 && (
             <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-semibold px-2.5 py-1 rounded-full shadow-md">
              {discount}% OFF
            </div>
          )}
        </CardContent>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex-grow">
            {service.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-bold text-lg text-blue-500">
              ₹{service.price.toLocaleString('en-IN')}
            </p>
            {service.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{service.originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}


export default function InvitationCardsPage() {
  const [filter, setFilter] = useState('all');

  const filteredServices = filter === 'all'
    ? cardServices
    : cardServices.filter(service => 
        service.tags?.includes(filter)
    );

  return (
    <div className="bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-orange-500">
                InviteCards
            </h1>
            <p className="mt-1 max-w-3xl mx-auto text-muted-foreground text-md">
                Beautiful Invitation Cards for Every Occasion
            </p>
        </div>

        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Browse by Category</h2>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="h-auto justify-start flex-wrap bg-transparent p-0 gap-2">
                {cardFilters.map(f => (
                    <TabsTrigger 
                        key={f.value} 
                        value={f.value}
                        className={cn(
                            "rounded-full border-transparent transition-all duration-300",
                             filter === f.value
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        {f.label}
                    </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        </div>
        
        {premiumSellers.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Premium Sellers</h2>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-sm mx-auto"
            >
              <CarouselContent className="-ml-1">
                {premiumSellers.map((service, index) => (
                  <CarouselItem key={index} className="pl-1 basis-3/4">
                    <div className="p-1">
                       <Link href={`/services/${service.slug}`} className="group block">
                        <Card className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
                           <CardContent className="p-0 relative">
                             {service.samples[0] && (
                               <div className="relative aspect-[3/4] w-full bg-muted/30 rounded-t-2xl">
                                 <Image 
                                   src={service.samples[0].url}
                                   alt={service.name}
                                   fill
                                   className="object-contain"
                                   data-ai-hint={service.samples[0].imageHint || 'wedding invitation'}
                                 />
                               </div>
                             )}
                           </CardContent>
                         </Card>
                       </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        )}
        
        <div className="mb-8">
           <h2 className="text-lg font-semibold mb-3">Top Rated</h2>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredServices.map(service => (
            <InvitationProductCard key={service.id} service={service} />
          ))}
        </div>
         {filteredServices.length === 0 && (
          <div className="text-center col-span-full py-16">
              <p className="text-muted-foreground text-lg">No designs found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
