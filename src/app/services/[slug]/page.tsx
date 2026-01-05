
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Clock } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Service } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServicePage() {
  const params = useParams();
  const { slug } = params;
  const db = useFirestore();

  const serviceRef = useMemoFirebase(() => {
    if (!db || !slug) return null;
    // We try both collections. A bit of a hack, but works for this structure.
    // A better structure might be a single 'products' collection.
    const servicePath = `services/${slug}`;
    return doc(db, servicePath);
  }, [db, slug]);

  const packageRef = useMemoFirebase(() => {
    if (!db || !slug) return null;
    return doc(db, `comboPackages/${slug}`);
  }, [db, slug]);

  const { data: serviceData, isLoading: isServiceLoading } = useDoc<Service>(serviceRef);
  const { data: packageData, isLoading: isPackageLoading } = useDoc<any>(packageRef);

  const isLoading = isServiceLoading || isPackageLoading;
  
  const item: Service | null = useMemo(() => {
    if (serviceData) {
        return serviceData;
    }
    if (packageData) {
        return {
            id: packageData.id,
            slug: packageData.slug,
            name: packageData.name,
            description: packageData.description,
            price: parseFloat(packageData.price.replace(/[^0-9.]/g, '')) || 0,
            category: 'combo-packages',
            samples: [],
            inclusions: packageData.features,
            priceType: 'fixed',
            deliveryTime: 'N/A',
            isFeatured: packageData.isBestValue,
        };
    }
    return null;
  }, [serviceData, packageData]);
  
  if (isLoading) {
      return (
          <div className="container mx-auto px-4 py-12 md:py-20">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div>
                       <Skeleton className="aspect-video w-full mb-4 rounded-lg" />
                       <div className="grid grid-cols-2 gap-4">
                           <Skeleton className="aspect-video w-full rounded-lg" />
                           <Skeleton className="aspect-video w-full rounded-lg" />
                       </div>
                   </div>
                   <div className="space-y-4">
                       <Skeleton className="h-6 w-24 rounded-full" />
                       <Skeleton className="h-10 w-3/4" />
                       <Skeleton className="h-20 w-full" />
                       <Skeleton className="h-24 w-full" />
                       <Skeleton className="h-24 w-full" />
                   </div>
               </div>
          </div>
      )
  }

  if (!item) {
    notFound();
  }

  const imageSamples = item.samples.filter(s => s.type === 'image');
  const videoSample = item.samples.find(s => s.type === 'video');


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
                  alt={`${item.name} sample ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  data-ai-hint={sample.imageHint || 'wedding'}
                />
              </div>
            ))}
          </div>
            {imageSamples.length === 0 && !videoSample && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No sample available</p>
                </div>
            )}
        </div>

        {/* Details */}
        <div className="lg:sticky top-24 self-start">
          <Badge variant="secondary" className="mb-2 capitalize">{item.category.replace('-', ' ')}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">{item.name}</h1>
          <p className="text-muted-foreground text-lg mb-6">{item.description}</p>

          {item.inclusions && item.inclusions.length > 0 && (
            <div className="mb-6">
                <h3 className="font-headline text-xl font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2">
                {item.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-3 mt-1 shrink-0 text-green-500" />
                    <span>{item}</span>
                    </li>
                ))}
                </ul>
            </div>
          )}
          
          {item.deliveryTime && (
            <div className="flex items-center text-muted-foreground mb-8">
                <Clock className="h-5 w-5 mr-2" />
                <span>Delivery Timeline: {item.deliveryTime}</span>
            </div>
          )}

          <div className="bg-secondary/50 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price {item.priceType === 'starting' ? 'starts from' : ''}</p>
              <p className="font-headline text-3xl font-bold">
                ₹{item.price.toLocaleString('en-IN')}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={`/order?service=${item.id}`}>
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
