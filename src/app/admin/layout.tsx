
"use client";

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
import { PanelLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
             <a href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="">{siteConfig.name}</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <AdminNav />
            </nav>
          </div>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* MOBILE SIDEBAR TRIGGER */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
               <SheetHeader>
                <SheetTitle>
                   <a href="/" className="flex items-center gap-2 font-semibold">
                     <Logo className="h-6 w-6 text-primary" />
                     <span className="">{siteConfig.name}</span>
                   </a>
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium">
                <AdminNav />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
            {/* Can add search bar here */}
          </div>

          {/* User menu can be added here */}

        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
