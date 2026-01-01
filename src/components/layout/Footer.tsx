
import Link from 'next/link';
import { siteConfig, footerLinks } from '@/lib/constants';
import Logo from '../shared/Logo';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  isHomePage: boolean;
}

export default function Footer({ isHomePage }: FooterProps) {
  return (
    <footer className="bg-card border-t">
      {isHomePage && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {/* Brand Info */}
            <div className="flex flex-col">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Logo className="h-10 w-auto text-primary" />
                <span className="font-bold text-2xl">{siteConfig.name}</span>
              </Link>
              <p className="text-muted-foreground">{siteConfig.tagline}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
