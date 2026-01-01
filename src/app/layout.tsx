
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
import { FirebaseClientProvider, initiateAnonymousSignIn, useUser, auth } from '@/firebase';

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

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user]);

  return <>{children}</>;
}


// export const metadata: Metadata = {
//   title: 'ApnaBandhan | Wedding Invitations • Videos • Albums',
//   description: 'Complete Wedding Invitation, Video & Album Solution. Professional and affordable wedding services for your special day.',
//   keywords: 'indian wedding invitations, wedding videos, wedding albums, save the date video, e-invites, ApnaBandhan',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = ['/admin/login', '/login', '/signup', '/forgot-password'].includes(pathname);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const AppContent = () => (
    <>
      {!isAdminRoute && <Header isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer isHomePage={pathname === '/'} />}
      {!isAdminRoute && <BottomNav setMenuOpen={setMenuOpen} />}
      <Toaster />
    </>
  );

  if (isAuthRoute && !isAdminRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
         <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-body antialiased',
            fontInter.variable,
            fontPlayfair.variable
          )}
        >
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </body>
      </html>
    );
  }

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
          <AuthHandler>
            <div className="relative flex min-h-dvh flex-col pb-16 md:pb-0">
                <AppContent />
            </div>
          </AuthHandler>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
