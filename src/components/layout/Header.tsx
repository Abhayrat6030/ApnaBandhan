
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X, Home, Package, Info, Mail, Gift } from 'lucide-react';
import { useState, type FC } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig, navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from '../shared/Logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type NavItem } from '@/lib/types';


const iconMap: Record<string, FC<React.ComponentProps<'svg'>>> = {
    '/': Home,
    '/services': Gift,
    '/packages': Package,
    '/about': Info,
    '/contact': Mail
};

interface HeaderProps {
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
}

export default function Header({ isMenuOpen, setMenuOpen }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-primary" />
            <span className="font-bold sm:inline-block text-lg">{siteConfig.name}</span>
          </Link>
        </div>

        <div className="flex items-center gap-x-4">
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

            <div className="flex items-center space-x-2">
            <Button asChild variant="ghost" className="hidden lg:flex items-center">
                <a href={`tel:${siteConfig.phone.replace(/[\s+]/g, '')}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {siteConfig.phone}
                </a>
            </Button>
            <Button asChild size="sm">
                <Link href="/order">Order Now</Link>
            </Button>

            {/* Mobile Nav Sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="left" className="p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <Logo className="h-8 w-auto text-primary" />
                    <span className="font-bold">{siteConfig.name}</span>
                    </Link>
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                    <div className="py-4 pl-6 pr-6">
                    <div className="flex flex-col space-y-1">
                        {navItems.map((item: NavItem) => {
                        const Icon = iconMap[item.href];
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:bg-muted',
                                    pathname === item.href ? 'bg-muted text-primary font-semibold' : 'text-foreground'
                                )}
                            >
                                {Icon && <Icon className="h-5 w-5" />}
                                <span className="text-lg">{item.label}</span>
                            </Link>
                        )
                        })}
                    </div>
                    </div>
                </ScrollArea>
                <div className="p-6 border-t mt-auto">
                    <Button asChild className="w-full" size="lg">
                        <Link href="/profile/orders" onClick={() => setMenuOpen(false)}>Order Now</Link>
                    </Button>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
