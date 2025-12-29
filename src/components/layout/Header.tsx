'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig, navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from '../shared/Logo';

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto text-primary" />
            <span className="font-bold font-headline hidden sm:inline-block">{siteConfig.name}</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" className="hidden lg:flex items-center">
             <Phone className="mr-2 h-4 w-4" />
             {siteConfig.phone}
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 hidden md:flex">
            <Link href="/order">Order Now</Link>
          </Button>

          {/* Mobile Nav */}
          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                   <Logo className="h-8 w-auto text-primary" />
                  <span className="font-bold font-headline">{siteConfig.name}</span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'text-lg transition-colors hover:text-primary',
                        pathname === item.href ? 'text-primary font-semibold' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
               <div className="pl-6">
                 <Button asChild className="w-full">
                    <Link href="/order" onClick={() => setMenuOpen(false)}>Order Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
