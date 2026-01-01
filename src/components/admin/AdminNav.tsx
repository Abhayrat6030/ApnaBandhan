

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavItems } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ShoppingCart, List, Sparkles, Home, Gift, Info, Mail, Package, Users, Bell, Download, FileText, Award, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const icons: { [key: string]: React.ElementType } = {
  '/admin/dashboard': LayoutDashboard,
  '/admin/orders': ShoppingCart,
  '/admin/services': List,
  '/admin/users': Users,
  '/admin/notifications': Bell,
  '/admin/downloads': Download,
  '/admin/ai-enhancer': Sparkles,
  '/admin/requests': FileText,
  '/admin/rewards': Award,
  '/admin/referrals': Gift,
  '/admin/settings': Settings,
  '/': Home,
  '/services': Gift,
  '/packages': Package,
  '/about': Info,
  '/contact': Mail,
};

interface AdminNavProps {
    onLinkClick?: () => void;
}

export default function AdminNav({ onLinkClick }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="py-2">
        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin</h3>
        {adminNavItems.map((item) => {
            const Icon = icons[item.href as keyof typeof icons] || LayoutDashboard;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
            <Button
                key={item.label}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start w-full"
                onClick={onLinkClick}
            >
                <Link href={item.href} >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
                </Link>
            </Button>
            );
        })}
      </div>
    </>
  );
}
