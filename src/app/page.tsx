
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Heart, Film, Printer, Gift } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { services, whyChooseUs } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { ServiceCard } from '@/components/shared/ServiceCard';

const featuredServices = services.filter(s => s.isFeatured);

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-primary/10">
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

      {/* Sample Showcase Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
              Best Sample Showcase
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              A glimpse of the beautiful memories we help create.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {placeholderImages.showcase.map((item) => (
              <Card key={item.id} className="overflow-hidden group relative aspect-w-1 aspect-h-1">
                <Image
                  src={item.imageUrl}
                  alt={item.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.imageHint}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-semibold text-lg text-center px-2">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
              Why Choose ApnaBandhan?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We are committed to providing exceptional quality and service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="p-6">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <div className="bg-primary/20 p-3 rounded-full">
                       {item.icon === 'Heart' && <Heart className="h-8 w-8 text-primary" />}
                       {item.icon === 'Film' && <Film className="h-8 w-8 text-primary" />}
                       {item.icon === 'Printer' && <Printer className="h-8 w-8 text-primary" />}
                       {item.icon === 'Gift' && <Gift className="h-8 w-8 text-primary" />}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
            Ready to Start Your Beautiful Journey?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto opacity-90">
            Let's create something unforgettable for your wedding. Contact us today!
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/order">
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
