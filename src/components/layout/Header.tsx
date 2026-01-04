
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ArrowRight } from 'lucide-react';
import { type FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig, navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from '../shared/Logo';

interface HeaderProps {
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
}

export default function Header({ isMenuOpen, setMenuOpen }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-primary" />
          <span className="font-bold sm:inline-block text-lg">{siteConfig.name}</span>
        </Link>
        
        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetContent side="left" className="flex flex-col w-full max-w-[300px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setMenuOpen(false)}>
                      <Logo className="h-6 w-6 text-primary" />
                      <span className="">{siteConfig.name}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 flex flex-col justify-between">
                    <nav className="grid gap-2 text-base font-medium p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                                pathname === item.href && 'bg-muted text-primary'
                            )}
                            >
                            {Icon && <Icon className="h-5 w-5" />}
                            {item.label}
                        </Link>
                        )
                    })}
                    </nav>
                    <div className="p-4 border-t">
                        <Button asChild className="w-full" size="lg">
                            <Link href="/order" onClick={() => setMenuOpen(false)}>
                                Order Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
              </SheetContent>
        </Sheet>


        <div className="flex items-center justify-end gap-x-2">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
                <Link
                key={item.label}
                href={item.href}
                className={cn(
                    'transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
                >
                {item.label}
                </Link>
            ))}
            </nav>

            <div className="flex items-center space-x-4 ml-6">
                <Button asChild variant="ghost" className="hidden lg:flex items-center">
                    <a href={`tel:${siteConfig.phone.replace(/[\s+]/g, '')}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {siteConfig.phone}
                    </a>
                </Button>
                <Button asChild size="sm">
                    <Link href="/order">Order Now</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
