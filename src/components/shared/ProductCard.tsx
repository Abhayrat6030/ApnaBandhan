
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '../ui/badge';

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
                </div>
            )}
            <div className="p-4">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">{formattedCategory}</p>
                <p className="font-bold text-lg mt-2">₹{service.price.toLocaleString('en-IN')}</p>
            </div>
            </CardContent>
        </Card>
    </Link>
  );
}
