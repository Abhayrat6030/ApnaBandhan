
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Mails, Album, Package as PackageIcon, Video, FileText, Sparkles, Loader2, Copy } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { services, packages, serviceCategories } from '@/lib/data';
import { siteConfig } from '@/lib/constants';
import placeholderImages from '@/lib/placeholder-images.json';
import { ProductCard } from '@/components/shared/ProductCard';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateInvitationText } from '@/ai/flows/generate-invitation-text';

const topRatedVideos = services.filter(s => s.category === 'invitation-videos');
const topRatedCards = services.filter(s => s.category === 'invitation-cards');
const topRatedAlbums = services.filter(s => s.category === 'album-design');
const topRatedVideoEditing = services.filter(s => s.category === 'video-editing');
const cdrFileServices = services.filter(s => s.tags?.includes('cdr-file'));
const comboPackages = packages;


const categoryIcons = {
  'invitation-videos': Film,
  'invitation-cards': Mails,
  'album-design': Album,
  'combo-packages': PackageIcon,
  'video-editing': Video,
  'cdr-files': FileText,
  'website-development': FileText,
};

const formSchema = z.object({
  brideName: z.string().min(2, "Please enter the bride's name."),
  groomName: z.string().min(2, "Please enter the groom's name."),
  eventType: z.string().min(1, "Please select an event type."),
  tone: z.string().min(1, "Please select a tone."),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;


export default function Home() {
    const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [generatedText, setGeneratedText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: '',
      groomName: '',
      eventType: 'Wedding',
      tone: 'Formal',
      additionalInfo: '',
    },
  });

  async function onAiSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedText('');
    try {
      const result = await generateInvitationText(values);
      if (result.invitationText) {
        setGeneratedText(result.invitationText);
        toast({ title: 'Content Generated!', description: 'Your invitation text is ready.' });
      } else {
        throw new Error('AI did not return any text.');
      }
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({ title: 'Copied to Clipboard!' });
  };


  return (
    <div className="flex flex-col overflow-hidden animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-primary/10">
        <Image
          src={placeholderImages.hero.imageUrl}
          alt={placeholderImages.hero.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={placeholderImages.hero.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight !leading-tight">
            {siteConfig.name}
          </h1>
          <p className="mt-2 md:mt-4 max-w-2xl text-base md:text-xl text-primary-foreground/90">
            {siteConfig.tagline}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild className="md:size-auto">
              <Link href="/services">
                View Samples <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="md:size-auto bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
               <Link href={`https://wa.me/${siteConfig.phone.replace(/[\s+]/g, '')}`} target="_blank">
                WhatsApp Order
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-2 bg-background border-b">
        <div className="container mx-auto px-4">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            opts={{
                align: "start",
                loop: true,
            }}
            >
            <CarouselContent className="-ml-2">
                {serviceCategories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
                return (
                    <CarouselItem key={category.id} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[15%]">
                        <Link href={category.href} className="group block">
                            <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted text-center text-muted-foreground transition-colors group-hover:text-primary h-24">
                                {Icon && <Icon className="h-6 w-6" />}
                                <span className="text-xs font-medium leading-tight">{category.name}</span>
                            </div>
                        </Link>
                    </CarouselItem>
                )})}
            </CarouselContent>
            </Carousel>
        </div>
      </section>
      
      {/* AI Assistant Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto border-2 border-primary/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl md:text-3xl">
                    <Sparkles className="h-8 w-8 text-primary" />
                    AI Invitation Assistant
                    </CardTitle>
                    <CardDescription>
                    Let our AI help you craft the perfect words for your special occasion. Fill in the details below to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAiSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="brideName" render={({ field }) => (
                            <FormItem><FormLabel>Bride's Name</FormLabel><FormControl><Input placeholder="e.g., Priya" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="groomName" render={({ field }) => (
                            <FormItem><FormLabel>Groom's Name</FormLabel><FormControl><Input placeholder="e.g., Rohan" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="eventType" render={({ field }) => (
                                <FormItem><FormLabel>Event Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Wedding">Wedding</SelectItem>
                                    <SelectItem value="Engagement">Engagement</SelectItem>
                                    <SelectItem value="Save the Date">Save the Date</SelectItem>
                                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="tone" render={({ field }) => (
                                <FormItem><FormLabel>Tone</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Formal">Formal & Elegant</SelectItem>
                                    <SelectItem value="Modern">Modern & Casual</SelectItem>
                                    <SelectItem value="Funny">Funny & Playful</SelectItem>
                                    <SelectItem value="Traditional">Traditional & Respectful</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="additionalInfo" render={({ field }) => (
                            <FormItem><FormLabel>Additional Details (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Mention our love for travel. Request no gifts. Include a quote by Rumi." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Generate Content</>
                        )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                {(isLoading || generatedText) && (
                <CardFooter className="flex-col items-start">
                     <h3 className="font-semibold mb-2">Generated Content:</h3>
                    {isLoading ? (
                        <div className="w-full space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="relative w-full">
                        <pre className="p-4 bg-secondary/50 rounded-md whitespace-pre-wrap font-body text-sm text-foreground w-full">
                            {generatedText}
                        </pre>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={copyToClipboard}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        </div>
                    )}
                </CardFooter>
                 )}
            </Card>
        </div>
      </section>

      {/* Top Rated Videos Section */}
      {topRatedVideos.length > 0 && <section id="top-videos" className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              Invitation Videos
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Stunning videos to announce your special day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideos.slice(0, 4).map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/invitation-videos">
                View All Videos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}
      
      {/* Top Rated Cards Section */}
      {topRatedCards.length > 0 && <section id="top-cards" className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              Invitation Cards
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Elegant digital and printable invitations.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedCards.slice(0, 4).map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/invitation-cards">
                View All Cards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

       {/* Top Rated Album Designs Section */}
      {topRatedAlbums.length > 0 && <section id="top-albums" className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
           <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              Album Designs
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Timeless designs to preserve your memories.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedAlbums.slice(0, 4).map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/album-design">
                View All Designs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

       {/* Top Rated Video Editing Section */}
      {topRatedVideoEditing.length > 0 && <section id="top-video-editing" className="py-8 bg-background">
        <div className="container mx-auto px-4">
           <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              Wedding Video Editing
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Cinematic edits of your precious moments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRatedVideoEditing.slice(0, 4).map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/video-editing">
                View All Editing Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

      {/* Combo Packages Section */}
      {comboPackages.length > 0 && <section id="combo-packages" className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
           <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              Combo Packages
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Get the best value with our curated packages.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {comboPackages.slice(0, 3).map((pkg) => {
                const service = services.find(s => s.id === pkg.id);
                if (!service) return null;
                // A bit of a hack to show package price
                const serviceWithPackagePrice = {...service, price: parseFloat(pkg.price.replace(/[^0-9.]/g, '')), originalPrice: undefined};
                return <ProductCard key={service.id} service={serviceWithPackagePrice} />;
            })}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/packages">
                View All Packages <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}
      
      {/* CDR Files Section */}
      {cdrFileServices.length > 0 && <section id="cdr-files" className="py-8 bg-background">
        <div className="container mx-auto px-4">
           <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-0">
              CDR Files
            </h2>
            <p className="text-lg text-muted-foreground mt-1">Get print-ready source files for your cards.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {cdrFileServices.slice(0, 4).map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/invitation-cards?filter=cdr-file">
                View All CDR Files <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>}

      {/* Website Development Section */}
      <section id="website-development" className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center bg-card p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-primary">
              Full Professional Website
            </h2>
            <p className="text-lg text-muted-foreground mt-1 max-w-2xl mx-auto">
              Need a complete website for your business or personal brand? We can create a stunning, professional, and fast website tailored to your needs.
            </p>
            <div className="text-center mt-6">
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Contact Us For A Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
