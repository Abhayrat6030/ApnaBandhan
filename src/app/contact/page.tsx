import { siteConfig } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" {...props}>
    <path
      d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.116-.975-1.297a.42.42 0 0 0-.465-.137c-.528.27-1.357.94-1.763 1.545-.448.655-.79 1.336-.79 2.278 0 1.01.606 1.902 1.207 2.472.62.58 1.35 1.01 2.288 1.396.98.405 1.93.58 2.67.58.92.001 1.92-.37 2.58-.91.68-.56.98-.94.98-1.49 0-.46-.427-1.08-.68-1.39a.63.63 0 0 0-.415-.175Z"
      fill="currentColor"
    />
    <path
      d="M16.002 2a14 14 0 1 0 14 14 14 14 0 0 0-14-14Zm0 26.4a12.4 12.4 0 1 1 12.4-12.4 12.4 12.4 0 0 1-12.4 12.4Z"
      fill="currentColor"
    />
  </svg>
);


export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      value: `+${siteConfig.phone}`,
      href: `tel:+${siteConfig.phone}`,
      cta: 'Call Now'
    },
    {
      icon: WhatsAppIcon,
      title: 'WhatsApp',
      value: 'Chat with us directly',
      href: `https://wa.me/${siteConfig.phone}`,
      cta: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Us',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      cta: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      value: siteConfig.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`,
      cta: 'Get Directions'
    },
  ];

  return (
    <div className="bg-secondary/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Get In Touch
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
            We're excited to hear about your special day! Reach out to us with any questions or to start planning your perfect wedding invitations and videos.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
            <Card key={index} className="text-center flex flex-col items-center p-6 bg-card hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                <method.icon className="h-8 w-8 text-primary" />
                </div>
                <CardHeader className="p-0 mb-2">
                    <CardTitle className="font-headline text-xl">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <p className="text-muted-foreground">{method.value}</p>
                </CardContent>
                <Button asChild variant="secondary" className="w-full mt-4">
                <Link href={method.href} target={method.href.startsWith('http') ? '_blank' : '_self'}>{method.cta}</Link>
                </Button>
            </Card>
            ))}
        </div>

        <div className="max-w-4xl mx-auto">
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-3">
                        <Clock className="mr-3 h-6 w-6 text-primary" />
                        <span>Our Working Hours</span>
                    </CardTitle>
                    <CardDescription>
                        We are available to assist you during the following hours.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{siteConfig.workingHours}</p>
                    <p className="text-sm text-muted-foreground mt-2">We typically respond to emails and WhatsApp messages within a few hours during business hours. For urgent matters, please feel free to call us.</p>
                </CardContent>
            </Card>
        </div>
        </div>
    </div>
  );
}
