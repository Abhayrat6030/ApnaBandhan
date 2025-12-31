import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/lib/types';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {service.samples[0]?.type === 'image' && (
        <div className="relative aspect-video w-full">
            <Image 
                src={service.samples[0].url}
                alt={service.name}
                fill
                className="object-cover"
                data-ai-hint={service.samples[0].imageHint || 'wedding'}
            />
        </div>
      )}
      <CardHeader className="p-6">
        <Badge variant="outline" className="mb-2 capitalize w-fit">{service.category.replace('-', ' ')}</Badge>
        <CardTitle className="font-bold text-xl mb-2">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2">{service.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div>
            <p className="text-sm text-muted-foreground">{service.priceType === 'starting' ? 'Starts from' : 'Price'}</p>
            <p className="font-semibold text-lg">₹{service.price.toLocaleString('en-IN')}</p>
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
