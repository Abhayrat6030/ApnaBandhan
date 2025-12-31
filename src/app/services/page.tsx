import { services, serviceCategories } from '@/lib/data';
import { ServiceCard } from '@/components/shared/ServiceCard';
import Link from 'next/link';

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

        {serviceCategories.map((category) => {
          const categoryServices = services.filter(s => s.category === category.id);
          if (categoryServices.length === 0) return null;

          return (
            <section key={category.id} className="mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-headline text-3xl font-bold tracking-tight capitalize">
                        <Link href={`/${category.id.replace('_', '-')}`} className="hover:text-primary transition-colors">
                            {category.name}
                        </Link>
                    </h2>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
