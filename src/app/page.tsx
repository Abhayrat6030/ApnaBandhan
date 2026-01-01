
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
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[30vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-primary/10">
        <Image
          src={placeholderImages.hero.imageUrl}
          alt={placeholderImages.hero.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={placeholderImages.hero.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 p-4 flex flex-col items-center animate-fade-in-up">
          <h1 className="font-bold text-4xl md:text-6xl tracking-tight !leading-tight">
            {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild variant="secondary" size="sm">
              <Link href="/services">
                View Samples <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
               <Link href={`https://wa.me/${siteConfig.phone}`} target="_blank">
                WhatsApp Order
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-2 bg-background border-b">
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
            <CarouselContent className="-ml-2">
                {serviceCategories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
                return (
                    <CarouselItem key={category.id} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[15%]">
                        <Link href={category.href} className="group block">
                            <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted text-center text-muted-foreground transition-colors group-hover:text-primary h-24">
                                {Icon && <Icon className="h-6 w-6" />}
                                <span className="text-xs font-medium leading-tight whitespace-nowrap">{category.name}</span>
                            </div>
                        </Link>
                    </CarouselItem>
                )})}
            </CarouselContent>
            </Carousel>
        </div>
      </section>

      {/* Top Rated Videos Section */}
      {topRatedVideos.length > 0 && <section id="top-videos" className="pt-8 pb-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Invitation Videos
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Stunning videos to announce your special day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideos.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/invitation-videos">
                View All Videos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}
      
      {/* Top Rated Cards Section */}
      {topRatedCards.length > 0 && <section id="top-cards" className="pt-8 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Invitation Cards
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Elegant digital and printable invitations.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedCards.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/invitation-cards">
                View All Cards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

       {/* Top Rated Album Designs Section */}
      {topRatedAlbums.length > 0 && <section id="top-albums" className="pt-8 pb-12 bg-secondary/30">
        <div className="container mx-auto px-4">
           <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Album Designs
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Timeless designs to preserve your memories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedAlbums.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/album-design">
                View All Designs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

       {/* Top Rated Video Editing Section */}
      {topRatedVideoEditing.length > 0 && <section id="top-video-editing" className="pt-8 pb-12 bg-background">
        <div className="container mx-auto px-4">
           <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Wedding Video Editing
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Cinematic edits of your precious moments.</p>
          </div>
          <div className="grid grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideoEditing.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/video-editing">
                View All Editing Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}


    </div>
  );
}
