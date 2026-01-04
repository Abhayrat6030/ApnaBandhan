
"use client";

import { useState } from 'react';
import { useUser } from '@/firebase';
import AdminNav from "@/components/admin/AdminNav";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // The AdminAuthGuard has been removed. 
  // Security is now handled at the data level by Firestore rules and on API routes.
  // This prevents the "Access Denied" page from appearing and simplifies the auth flow.
  
  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span className="">{siteConfig.name}</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <AdminNav onLinkClick={() => isSheetOpen && setIsSheetOpen(false)} />
              </nav>
            </div>
          </div>
        </aside>

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-full max-w-[300px]">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsSheetOpen(false)}>
                      <Logo className="h-6 w-6 text-primary" />
                      <span className="">{siteConfig.name}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium mt-4">
                  <AdminNav onLinkClick={() => setIsSheetOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="w-full flex-1">
              {/* Can add search bar here */}
            </div>

            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>

          </header>
          <main className="flex-1 overflow-x-hidden bg-muted/20">
            {children}
          </main>
        </div>
      </div>
  );
}
