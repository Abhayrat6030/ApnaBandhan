
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Mails, Album, Package as PackageIcon, Video } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";


import { Button } from '@/components/ui/button';
import { services, serviceCategories } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { ProductCard } from '@/components/shared/ProductCard';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


const topRatedVideos = services.filter(s => s.topRated && s.category === 'invitation-videos');
const topRatedCards = services.filter(s => s.topRated && s.category === 'invitation-cards');
const topRatedAlbums = services.filter(s => s.topRated && s.category === 'album-design');
const topRatedVideoEditing = services.filter(s => s.topRated && s.category === 'video-editing');


const categoryIcons = {
  'invitation-videos': Film,
  'invitation-cards': Mails,
  'album-design': Album,
  'combo-packages': PackageIcon,
  'video-editing': Video,
};


export default function Home() {
    const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[25vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-primary/10">
        <Image
          src={placeholderImages.hero.imageUrl}
          alt={placeholderImages.hero.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={placeholderImages.hero.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 flex flex-col items-center" data-aos="fade-up">
          <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="mt-3 max-w-2xl text-md md:text-lg text-primary-foreground/90">
            {siteConfig.tagline}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">
                View Samples <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
               <Link href={`https://wa.me/${siteConfig.phone}`} target="_blank">
                WhatsApp Order
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-2 bg-background">
        <div className="container mx-auto px-4">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            opts={{
                align: "start",
                loop: true,
            }}
            >
            <CarouselContent className="-ml-1">
                {serviceCategories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
                return (
                    <CarouselItem key={category.id} className="pl-1 basis-[28%] sm:basis-1/5 md:basis-[15%]">
                        <Link href={category.href} className="group block">
                            <div className="flex flex-col items-center justify-center gap-1 p-1 rounded-lg hover:bg-muted text-center text-muted-foreground transition-colors group-hover:text-primary h-24">
                                {Icon && <Icon className="h-7 w-7" />}
                                <span className="text-xs sm:text-sm font-medium leading-tight">{category.name}</span>
                            </div>
                        </Link>
                    </CarouselItem>
                )})}
            </CarouselContent>
            </Carousel>
        </div>
      </section>

      {/* Top Rated Videos Section */}
      {topRatedVideos.length > 0 && <section id="top-videos" className="py-8 md:py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl tracking-tight">
              Invitation Videos
            </h2>
             <Button asChild variant="outline" size="sm">
              <Link href="/invitation-videos">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideos.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>}
      
      {/* Top Rated Cards Section */}
      {topRatedCards.length > 0 && <section id="top-cards" className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl tracking-tight">
              Invitation Cards
            </h2>
             <Button asChild variant="outline" size="sm">
              <Link href="/invitation-cards">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedCards.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>}

       {/* Top Rated Album Designs Section */}
      {topRatedAlbums.length > 0 && <section id="top-albums" className="py-8 md:py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl tracking-tight">
              Album Designs
            </h2>
             <Button asChild variant="outline" size="sm">
              <Link href="/album-design">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedAlbums.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>}

       {/* Top Rated Video Editing Section */}
      {topRatedVideoEditing.length > 0 && <section id="top-video-editing" className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-2xl tracking-tight">
              Wedding Video Editing
            </h2>
             <Button asChild variant="outline" size="sm">
              <Link href="/video-editing">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideoEditing.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>}


    </div>
  );
}
