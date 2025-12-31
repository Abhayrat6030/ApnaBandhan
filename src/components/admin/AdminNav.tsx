'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { adminNavItems } from '@/lib/constants';
import { LayoutDashboard, ShoppingCart, List, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/orders': ShoppingCart,
  '/admin/services': List,
  '/admin/ai-enhancer': Sparkles,
};

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {adminNavItems.map((item) => {
        const Icon = icons[item.href as keyof typeof icons] || LayoutDashboard;
        return (
          <SidebarMenuItem key={item.label} asChild>
            <Link href={item.href} className="w-full">
              <SidebarMenuButton
                className={cn(
                  pathname.startsWith(item.href) && item.href !== '/admin'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : '',
                   pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
