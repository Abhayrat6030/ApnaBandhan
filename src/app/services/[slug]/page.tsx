
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Clock } from 'lucide-react';

type ServicePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const imageSamples = service.samples.filter(s => s.type === 'image');
  const videoSample = service.samples.find(s => s.type === 'video');


  return (
    <div className="container mx-auto px-4 py-12 md:py-20 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          {videoSample && (
            <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg border">
               <iframe
                className="w-full h-full"
                src={videoSample.url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {imageSamples.map((sample, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={sample.url}
                  alt={`${service.name} sample ${index + 1}`}
                  fill
                  className="object-cover"
                  data-ai-hint={sample.imageHint || 'wedding'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky top-24 self-start">
          <Badge variant="secondary" className="mb-2 capitalize">{service.category.replace('-', ' ')}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">{service.name}</h1>
          <p className="text-muted-foreground text-lg mb-6">{service.description}</p>

          <div className="mb-6">
            <h3 className="font-headline text-xl font-semibold mb-3">What's Included:</h3>
            <ul className="space-y-2">
              {service.inclusions.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 mr-3 mt-1 shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center text-muted-foreground mb-8">
            <Clock className="h-5 w-5 mr-2" />
            <span>Delivery Timeline: {service.deliveryTime}</span>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price {service.priceType === 'starting' ? 'starts from' : ''}</p>
              <p className="font-headline text-3xl font-bold">
                ₹{service.price.toLocaleString('en-IN')}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={`/order?service=${service.id}`}>
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
