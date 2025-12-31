
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavItems } from '@/lib/constants';
import { LayoutDashboard, ShoppingCart, List, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const icons = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/orders': ShoppingCart,
  '/admin/services': List,
  '/admin/ai-enhancer': Sparkles,
};

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {adminNavItems.map((item) => {
        const Icon = icons[item.href as keyof typeof icons] || LayoutDashboard;
        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
        return (
          <Button
            key={item.label}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className="justify-start"
          >
            <Link href={item.href} >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </>
  );
}
