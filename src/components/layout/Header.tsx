
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useState, type FC } from 'react';

import { Button } from '@/components/ui/button';
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
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-primary" />
            <span className="font-bold sm:inline-block text-lg">{siteConfig.name}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-2">
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
