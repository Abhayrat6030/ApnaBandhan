
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { services } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { ServiceCard } from '@/components/shared/ServiceCard';

const featuredServices = services.filter(s => s.isFeatured);

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[30vh] md:h-[40vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-primary/10">
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
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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

      {/* Featured Services Section */}
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
              Our Core Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Everything you need to make your wedding announcements special and memorable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/services">
                Explore All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
