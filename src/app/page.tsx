
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Mails, Album, Package as PackageIcon, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { services, serviceCategories } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { cn } from '@/lib/utils';

const featuredServices = services.filter(s => s.isFeatured);

const categoryIcons = {
  'invitation-videos': Film,
  'invitation-cards': Mails,
  'album-design': Album,
  'combo-packages': PackageIcon,
  'video-editing': Video,
};


export default function Home() {
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
          <div className="flex flex-row justify-around items-center border-b">
            {serviceCategories.map((category, index) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
              return (
                <Link href={category.href} key={category.id} className="flex-1 group">
                    <div className={cn(
                        "flex flex-col items-center justify-center gap-2 py-4 text-center text-muted-foreground transition-colors group-hover:text-primary",
                    )}>
                        {Icon && <Icon className="h-7 w-7" />}
                        <span className="text-sm font-medium">{category.name}</span>
                    </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section id="services" className="py-8 md:py-12 bg-secondary/20">
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
