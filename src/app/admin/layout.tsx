
"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
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
import { PanelLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

/**
 * This component is responsible for synchronizing the client-side Firebase Auth state
 * with a server-side session cookie (`__session`). This is crucial for authenticating
 * server actions and API routes.
 */
function SessionManager() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.email === ADMIN_EMAIL) {
        // User is an admin, ensure server session exists.
        user.getIdToken().then(async (idToken) => {
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            console.error("Failed to create server session");
            toast({
              title: "Session Sync Failed",
              description: "Could not authenticate with the server. Some actions may not work.",
              variant: "destructive",
            });
          }
           setIsSyncing(false);
        });
      } else {
         // User is not an admin, no server session needed for them here.
         setIsSyncing(false);
      }
    } else if (user === null) {
      // User is logged out, clear any server session.
      fetch('/api/auth/session', { method: 'DELETE' });
      setIsSyncing(false);
    }
  }, [user, toast]);
  
  // While syncing, show a loading state to prevent premature rendering or actions
  if (isSyncing) {
       return (
          <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
            <div className="p-8">
                <Skeleton className="h-32 w-full max-w-md" />
            </div>
          </div>
       );
  }

  return null; // This component doesn't render anything itself
}


function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  
  // Show a loading screen while the user state is being determined.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="p-8">
            <Skeleton className="h-32 w-full max-w-md" />
        </div>
      </div>
    );
  }

  // Once user state is loaded, check for authorization.
  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
        <Card className="max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                  <ShieldAlert className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">You do not have permission to view this page. Please log in with an administrator account.</p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  // If authorized, render the session manager and the actual content.
  return (
    <>
      <SessionManager />
      {children}
    </>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span className="">{siteConfig.name}</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <AdminNav onLinkClick={() => isSheetOpen && setSheetOpen(false)} />
              </nav>
            </div>
          </div>
        </aside>

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
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
                    <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setSheetOpen(false)}>
                      <Logo className="h-6 w-6 text-primary" />
                      <span className="">{siteConfig.name}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                  <AdminNav onLinkClick={() => setSheetOpen(false)} />
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
          <main className="flex flex-1 flex-col bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
