
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, LayoutGrid, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navItems as mainNavItems } from '@/lib/constants';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/order', label: 'Order', icon: ShoppingCart },
  { href: '/services', label: 'Category', icon: LayoutGrid },
  { href: '/profile', label: 'Profile', icon: User },
];

interface BottomNavProps {
    setMenuOpen: (isOpen: boolean) => void;
}

export default function BottomNav({ setMenuOpen }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex flex-col items-center justify-center px-5 text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Menu className="w-5 h-5 mb-1" />
          <span className="text-xs">Menu</span>
        </button>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
