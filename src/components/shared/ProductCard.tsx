
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  service: Service;
}

export function ProductCard({ service }: ProductCardProps) {
  const primaryImage = service.samples.find(s => s.type === 'image');

  const formattedCategory = service.category
    .replace('-', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Link href={`/services/${service.slug}`} className="group block">
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
            <CardContent className="p-0">
            {primaryImage && (
                <div className="relative aspect-[3/4] w-full">
                    <Image 
                        src={primaryImage.url}
                        alt={service.name}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={primaryImage.imageHint || 'wedding invitation'}
                    />
                </div>
            )}
            <div className="p-3">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary">{service.name}</h3>
                <p className="text-xs text-muted-foreground capitalize mt-1">{formattedCategory}</p>
                <p className="font-bold text-base mt-1">₹{service.price.toLocaleString('en-IN')}</p>
            </div>
            </CardContent>
        </Card>
    </Link>
  );
}
