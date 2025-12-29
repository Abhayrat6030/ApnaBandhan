import Image from 'next/image';
import { Heart, Users, Target } from 'lucide-react';

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
             <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Heart className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h3 className="font-headline text-2xl font-semibold mb-2">Our Passion</h3>
            <p className="text-muted-foreground">We are driven by a love for storytelling and design. Capturing the emotion and joy of a wedding is at the heart of everything we do.</p>
          </div>
           <div className="p-6">
             <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h3 className="font-headline text-2xl font-semibold mb-2">Our Approach</h3>
            <p className="text-muted-foreground">We believe in a collaborative process. We listen to your ideas and work with you to bring your vision to life, ensuring your complete satisfaction.</p>
          </div>
           <div className="p-6">
             <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h3 className="font-headline text-2xl font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">To provide high-quality, accessible, and heartfelt wedding media services that celebrate love and create lasting memories for families.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
