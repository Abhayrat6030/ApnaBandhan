
'use client';

import * as React from 'react';
import { serviceCategories } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";


export default function ServicesPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Our Services
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            From beautiful invitations to cinematic wedding films, we offer a complete suite of services to make your wedding unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <Link key={category.id} href={category.href} className="group block h-full">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      data-ai-hint={category.imageHint}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm font-semibold text-primary group-hover:underline">
                      View All <ArrowRight className="inline-block ml-1 h-4 w-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
