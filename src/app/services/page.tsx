
'use client';

import * as React from 'react';
import { serviceCategories } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Film, Mails, Album, Package as PackageIcon, Video, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ServiceCategoryInfo } from '@/lib/types';


const categoryIcons: { [key: string]: React.ElementType } = {
  'invitation-videos': Film,
  'invitation-cards': Mails,
  'album-design': Album,
  'combo-packages': PackageIcon,
  'video-editing': Video,
  'cdr-files': FileText,
};


export default function ServicesPage() {

  return (
    <div className="bg-background overflow-hidden">
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
              const Icon = categoryIcons[category.id] || Film;
              return (
              <Link key={category.id} href={category.href} className="group block h-full">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-bold text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm font-semibold text-primary group-hover:underline">
                      View All <ArrowRight className="inline-block ml-1 h-4 w-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )})}
        </div>
      </div>
    </div>
  );
}
