
import { serviceCategories } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Film, Heart, Package, Image as ImageIcon } from 'lucide-react';

const categoryIcons: { [key: string]: React.ElementType } = {
    'invitation-videos': Film,
    'invitation-cards': ImageIcon,
    'combo-packages': Package,
    'album-design': Heart,
    'video-editing': Film,
};


export default function ServicesPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Our Services
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            From beautiful invitations to cinematic wedding films, we offer a complete suite of services to make your wedding unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => {
                 const Icon = categoryIcons[category.id] || Heart;
                 return (
                    <Link key={category.id} href={category.href} className="group">
                        <Card className="h-full flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                            <CardHeader className="p-0">
                                <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="font-bold text-xl">{category.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-4 flex-grow">
                                <p className="text-muted-foreground">{category.description}</p>
                            </CardContent>
                             <div className="mt-6 text-sm font-semibold text-primary group-hover:underline">
                                View All <ArrowRight className="inline-block ml-1 h-4 w-4" />
                            </div>
                        </Card>
                    </Link>
                 )
            })}
        </div>
      </div>
    </div>
  );
}
