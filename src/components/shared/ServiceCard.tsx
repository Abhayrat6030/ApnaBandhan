import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/lib/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const imageSample = service.samples.find(s => s.type === 'image');

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          {imageSample ? (
            <Image
              src={imageSample.url}
              alt={service.name}
              fill
              className="object-cover"
              data-ai-hint={imageSample.imageHint || 'wedding service'}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <p className="text-muted-foreground">No Image</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Badge variant="secondary" className="mb-2">{service.category.replace('-', ' ')}</Badge>
        <CardTitle className="font-headline text-xl mb-2">{service.name}</CardTitle>
        <p className="text-muted-foreground line-clamp-3">{service.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="font-semibold text-lg">
          ₹{service.price.toLocaleString('en-IN')}
          {service.priceType === 'starting' && <span className="text-sm font-normal text-muted-foreground"> onwards</span>}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/services/${service.slug}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
