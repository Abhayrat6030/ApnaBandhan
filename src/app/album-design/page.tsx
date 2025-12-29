import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, ImageIcon, Printer } from 'lucide-react';

export default function AlbumDesignPage() {
  const albumService = services.find(s => s.category === 'album-design');

  if (!albumService) return null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-secondary">
        <Image
          src="https://picsum.photos/seed/ad-hero/1920/1080"
          alt="Beautiful wedding album"
          fill
          priority
          className="object-cover"
          data-ai-hint="wedding album"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
            Wedding Album Designing
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            A timeless treasure to cherish your most precious moments.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">
              Your Story, Beautifully Told
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our expert designers craft each wedding album with a personal touch, weaving your photos into a narrative that you can relive for years to come. We focus on clean, elegant layouts that let your memories shine.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4"><BookOpen className="h-6 w-6 text-primary" /></div>
                <div>
                  <h3 className="font-headline font-semibold">Creative Layouts</h3>
                  <p className="text-muted-foreground">From classic to contemporary, we design pages that are both unique and timeless.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4"><ImageIcon className="h-6 w-6 text-primary" /></div>
                <div>
                  <h3 className="font-headline font-semibold">Photo Curation Assistance</h3>
                  <p className="text-muted-foreground">We help you select the best photos to tell a cohesive and emotional story.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4"><Printer className="h-6 w-6 text-primary" /></div>
                <div>
                  <h3 className="font-headline font-semibold">Print-Ready Files</h3>
                  <p className="text-muted-foreground">Receive high-quality, print-ready files compatible with any professional printer.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg transform rotate-[-3deg] transition-transform hover:rotate-0 hover:scale-105">
              <Image src="https://picsum.photos/seed/ad-grid1/600/800" alt="Album page 1" fill className="object-cover" data-ai-hint="album page" />
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg transform rotate-[3deg] transition-transform hover:rotate-0 hover:scale-105 mt-8">
              <Image src="https://picsum.photos/seed/ad-grid2/600/800" alt="Album page 2" fill className="object-cover" data-ai-hint="wedding detail" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">
                Ready to Create Your Forever Album?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Our album design service starts from just <strong>₹{albumService.price.toLocaleString('en-IN')}</strong> for a 30-page design.
            </p>
            <Button asChild size="lg">
                <Link href={`/order?service=${albumService.id}`}>
                    Book Your Album Design <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
