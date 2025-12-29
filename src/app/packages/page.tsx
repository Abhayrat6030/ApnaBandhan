import { packages } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PackagesPage() {
  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Combo Packages
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            Get the best value with our curated packages, combining our most popular services.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {packages.map(pkg => (
            <Card key={pkg.id} className={cn(
                "flex flex-col h-full",
                pkg.isBestValue ? 'border-primary border-2 shadow-lg relative' : 'shadow-md'
            )}>
                {pkg.isBestValue && (
                    <Badge className="absolute -top-3 right-5 bg-primary text-primary-foreground">Best Value</Badge>
                )}
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="text-center mb-6">
                        <span className="font-headline text-4xl font-bold">{pkg.price}</span>
                        <span className="text-muted-foreground">/one-time</span>
                    </div>
                    <ul className="space-y-3">
                        {pkg.features.map(feature => (
                        <li key={feature} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 mt-1 shrink-0 text-green-500" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="p-6 mt-4">
                <Button asChild size="lg" className={cn("w-full", !pkg.isBestValue && "bg-accent text-accent-foreground hover:bg-accent/90")}>
                    <Link href={`/order?service=${pkg.id}`}>
                        Choose Package <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>

         <div className="text-center mt-12 text-muted-foreground">
            <p>Limited slots available for each package. Book now to secure your spot!</p>
        </div>
        </div>
    </div>
  );
}
