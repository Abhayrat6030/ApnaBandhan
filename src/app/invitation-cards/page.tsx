'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import { Service } from '@/lib/types';
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
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
const hotSellers = cardServices.filter(s => s.topRated).slice(0, 5);

// This is the newer card design
function NewInvitationProductCard({ service }: { service: Service }) {
  const discount = service.originalPrice && service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;
  
  const primaryImage = service.samples.find(s => s.type === 'image');
  const isTrending = service.topRated;
  const isHot = service.isFeatured;

  return (
    <Link href={`/services/${service.slug}`} className="group block">
      <Card className="overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-lg h-full border">
        <CardContent className="p-0 relative">
          {primaryImage && (
            <div className="relative aspect-[3/4] w-full bg-muted/20">
              <Image 
                src={primaryImage.url}
                alt={service.name}
                fill
                className="object-contain"
                data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
              />
               {isTrending && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Trending
                </div>
              )}
              {isHot && !isTrending && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Hot
                </div>
              )}
            </div>
          )}
        </CardContent>
        <div className="p-3 flex flex-col flex-grow bg-white">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{service.tags?.[0] || service.category.replace('-', ' ')}</p>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex-grow my-1">
            {service.name}
          </h3>
          {service.rating && (
            <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold">{service.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">(1k+)</span>
            </div>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-bold text-base text-foreground">
              ₹{service.price.toLocaleString('en-IN')}
            </p>
            {service.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{service.originalPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>
           {discount > 0 && (
             <div className="mt-1">
                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md inline-block">
                    {discount}% OFF
                </div>
            </div>
          )}
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

        {hotSellers.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Hot Sellers</h2>
               <Button variant="ghost" size="sm">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
             <div className="relative h-[400px] flex items-center justify-center">
              {hotSellers.map((service, index) => {
                const primaryImage = service.samples.find(s => s.type === 'image');
                if (!primaryImage) return null;
                
                const zIndex = hotSellers.length - index;
                const scale = 1 - (index * 0.05);
                const translateY = -index * 10;
                const isFront = index === 0;

                return (
                  <Link href={`/services/${service.slug}`} key={service.id} className="group block absolute transition-all duration-300 ease-out" style={{ zIndex, transform: `scale(${scale}) translateY(${translateY}px)` }}>
                     <Card className="overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 w-64 group-hover:scale-105">
                        <CardContent className="p-0 relative">
                            <div className="relative aspect-[3/4] w-full bg-muted/30">
                              <Image 
                                src={primaryImage.url}
                                alt={service.name}
                                fill
                                className="object-contain"
                                data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
                              />
                              {isFront && service.isFeatured && (
                                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                     <div className="bg-red-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                                         HOT
                                     </div>
                                 </div>
                              )}
                            </div>
                        </CardContent>
                     </Card>
                   </Link>
                )
              })}
             </div>
          </div>
        )}
        
        <div className="mb-8">
           <h2 className="text-lg font-semibold mb-3">Top Rated</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredServices.map(service => (
            <NewInvitationProductCard key={service.id} service={service} />
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
