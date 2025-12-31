

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  service: Service;
}

export function ProductCard({ service }: ProductCardProps) {
  const primaryImage = service.samples.find(s => s.type === 'image');

  const discount = service.originalPrice && service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/services/${service.slug}`} className="group block animate-fade-in-up">
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full rounded-2xl">
            <CardContent className="p-0">
            {primaryImage && (
                <div className="relative aspect-[3/4] w-full">
                    <Image 
                        src={primaryImage.url}
                        alt={service.name}
                        fill
                        className="object-cover rounded-t-2xl"
                        data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
                    />
                     <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discount > 0 && (
                            <Badge variant="destructive">{discount}% OFF</Badge>
                        )}
                         {service.price === 0 && (
                            <Badge className="bg-green-600 text-white">Free</Badge>
                        )}
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors pr-2">{service.name}</h3>
                    {service.rating && (
                        <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold">{service.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                
                <p className="font-bold text-lg mt-2 flex items-center gap-2">
                    <span>₹{service.price.toLocaleString('en-IN')}</span>
                     {service.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            ₹{service.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </p>
            </div>
            </CardContent>
        </Card>
    </Link>
  );
}
