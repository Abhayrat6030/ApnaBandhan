
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
                className="object-contain" // Changed to contain to show full image
                data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
              />
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 right-[-5px] bg-red-600 text-white text-xs font-bold px-3 py-1 -rotate-[-45deg] translate-x-[38%] translate-y-[90%] opacity-80">
            </div>
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
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 42, s: 5 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) {
          s--;
        } else {
          s = 59;
          if (m > 0) {
            m--;
          } else {
            m = 59;
            if (h > 0) {
              h--;
            } else {
              // Timer ended
              clearInterval(timer);
              return { h: 0, m: 0, s: 0 };
            }
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredServices = filter === 'all'
    ? cardServices
    : cardServices.filter(service => 
        service.tags?.includes(filter)
    );

  return (
    <div className="bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <div className="text-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-4 py-1.5 rounded-full mb-2">
                🔥 END OF SEASON SALE
            </div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Hot Deals on Invitation Cards
            </h1>
            <p className="mt-2 max-w-3xl mx-auto text-muted-foreground text-md">
                Limited time offer - Don't miss out!
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-4 text-gray-600">
                <span className="font-medium">Ends in:</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg bg-gray-100 text-gray-800 rounded-md px-3 py-1.5">{String(timeLeft.h).padStart(2, '0')}</span> h
                    <span className="font-bold text-lg bg-gray-100 text-gray-800 rounded-md px-3 py-1.5">{String(timeLeft.m).padStart(2, '0')}</span> m
                    <span className="font-bold text-lg bg-gray-100 text-gray-800 rounded-md px-3 py-1.5">{String(timeLeft.s).padStart(2, '0')}</span> s
                </div>
            </div>
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
