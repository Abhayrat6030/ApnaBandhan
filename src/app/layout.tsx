
'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import * as React from 'react';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import { FirebaseClientProvider, initiateAnonymousSignIn, useUser, useAuth } from '@/firebase';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontPlayfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});

function AuthHandler({ children }: { children: React.ReactNode }) {
  const { isUserLoading, user } = useUser();
  const auth = useAuth();

  React.useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = ['/admin/login', '/login', '/signup', '/forgot-password'].includes(pathname);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>ApnaBandhan | Wedding Invitations • Videos • Albums</title>
        <meta name="description" content="Complete Wedding Invitation, Video & Album Solution. Professional and affordable wedding services for your special day." />
        <meta name="keywords" content="indian wedding invitations, wedding videos, wedding albums, save the date video, e-invites, ApnaBandhan" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontInter.variable,
          fontPlayfair.variable
        )}
      >
        <FirebaseClientProvider>
          {isAuthRoute ? (
             <>
              <main className="flex-1">{children}</main>
              <Toaster />
             </>
          ) : (
            <AuthHandler>
              <div className="relative flex min-h-dvh flex-col pb-16 md:pb-0">
                  {!isAdminRoute && <Header isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />}
                  <main className="flex-1">{children}</main>
                  {!isAdminRoute && <Footer isHomePage={pathname === '/'} />}
                  {!isAdminRoute && <BottomNav setMenuOpen={setMenuOpen} />}
                  <Toaster />
              </div>
            </AuthHandler>
          )}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
