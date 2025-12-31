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
import { useSidebar } from '@/components/ui/sidebar';

const icons = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/orders': ShoppingCart,
  '/admin/services': List,
  '/admin/ai-enhancer': Sparkles,
};

export default function AdminNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {adminNavItems.map((item) => {
        const Icon = icons[item.href as keyof typeof icons] || LayoutDashboard;
        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.label} asChild>
            <Link href={item.href} className="w-full" onClick={() => setOpenMobile(false)}>
              <SidebarMenuButton
                isActive={isActive}
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
