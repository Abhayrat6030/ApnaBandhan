
import Image from 'next/image';
import { Heart, Film, Sparkles, Users, Target, Eye } from 'lucide-react';
import { whyChooseUs } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AboutUsPage() {
  const iconMap = { Heart, Film, Sparkles, Users };

  return (
    <div className="bg-background overflow-hidden animate-fade-in-up">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
            About ApnaBandhan
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            We are storytellers at heart, dedicated to capturing the magic of your most cherished moments.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-square w-full max-w-md mx-auto">
             <div className="absolute inset-0 bg-primary/10 rounded-full transform -rotate-12"></div>
             <div className="absolute inset-8 bg-secondary/20 rounded-full transform rotate-12"></div>
             <Image 
                src="https://picsum.photos/seed/about-team/600/600"
                alt="ApnaBandhan Team"
                width={600}
                height={600}
                className="relative z-10 rounded-full object-cover shadow-2xl border-4 border-background"
                data-ai-hint="team portrait"
             />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">
              Our Story
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              ApnaBandhan was born from a simple yet powerful idea: to make wedding preparations beautiful, personal, and stress-free. We saw couples and their families navigating the complexities of creating invitations and preserving memories, and we knew we could offer a better way—a solution that blends professional quality with heartfelt, personal touches.
            </p>
            <p className="text-muted-foreground text-lg">
              We are a passionate team of designers, editors, and digital artists who believe that every love story is unique and deserves to be told in a way that is just as special. We pour our hearts into every project, ensuring that what we create is not just a product, but a true reflection of your journey. For us, it’s a privilege to be a small part of your big day.
            </p>
          </div>
        </div>

        {/* Our Mission & Vision */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <span className="font-headline text-2xl">Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To provide couples with high-quality, creative, and affordable digital wedding solutions that simplify their planning and beautifully announce their special day to the world.</p>
            </CardContent>
          </Card>
           <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-primary" />
                <span className="font-headline text-2xl">Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To become the most trusted and beloved brand for wedding invitations and digital memories in India, known for our creativity, reliability, and exceptional customer care.</p>
            </CardContent>
          </Card>
        </div>


        {/* Why Choose Us Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
              Why Choose ApnaBandhan?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We are committed to providing exceptional quality and service, making your experience seamless and memorable.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {whyChooseUs.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || Heart;
              return (
              <div key={item.title} className="p-6">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <div className="bg-primary/20 p-3 rounded-full">
                       <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            )})}
          </div>
        </div>

        {/* Sample Showcase Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
              A Glimpse of Our Work
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Here's a sample of the beautiful memories we've helped create.
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
                <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-semibold text-lg">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
