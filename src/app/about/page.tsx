import Image from 'next/image';
import { Heart, Film, Printer, Gift } from 'lucide-react';
import { whyChooseUs } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { Card } from '@/components/ui/card';

export default function AboutUsPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            About ApnaBandhan
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            Crafting memories, one wedding at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-square w-full max-w-md mx-auto">
             <div className="absolute inset-0 bg-primary/10 rounded-full transform -rotate-12"></div>
             <div className="absolute inset-8 bg-secondary/20 rounded-full transform rotate-12"></div>
             <Image 
                src="https://picsum.photos/seed/about-team/600/600"
                alt="ApnaBandhan Team"
                width={600}
                height={600}
                className="relative z-10 rounded-full object-cover shadow-lg"
                data-ai-hint="team portrait"
             />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">
              Our Story
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              ApnaBandhan was born from a simple idea: to make wedding preparations easier and more beautiful for every family. We saw couples and their families stressing over invitations and videos, and we wanted to offer a solution that was not only professional and high-quality but also affordable and personal.
            </p>
            <p className="text-muted-foreground text-lg">
              We are a small, passionate team of designers, editors, and storytellers who believe that every wedding is unique. We pour our hearts into every project, ensuring that what we create is a true reflection of your love story. For us, this isn't just a business; it's a privilege to be a small part of your big day.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-24">
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

        {/* Sample Showcase Section */}
        <div>
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

      </div>
    </div>
  );
}
