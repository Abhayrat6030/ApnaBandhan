import { services } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlayCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function InvitationVideosPage() {
  const videoServices = services.filter(s => s.category === 'invitation-videos');

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Wedding Invitation Videos
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
          Announce your special day with a stunning video that captures your story.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videoServices.map((service) => {
          const imageSample = service.samples.find(s => s.type === 'image');
          return (
            <Card key={service.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <Link href={`/services/${service.slug}`} className="relative block aspect-video w-full">
                  {imageSample && (
                    <Image
                      src={imageSample.url}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={imageSample.imageHint || 'wedding video'}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                <h2 className="font-headline text-2xl font-semibold mb-2">{service.name}</h2>
                <p className="text-muted-foreground line-clamp-2">{service.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <div className="font-semibold text-lg">
                  Starts from ₹{service.price.toLocaleString('en-IN')}
                </div>
                <Button asChild variant="default">
                  <Link href={`/services/${service.slug}`}>
                    View &amp; Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
