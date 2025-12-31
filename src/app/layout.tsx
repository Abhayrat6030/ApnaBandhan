
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
import { FirebaseClientProvider } from '@/firebase';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontPlayfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});


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
  const isAuthRoute = pathname.startsWith('/admin/login');
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

  if (isAuthRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-body antialiased',
            fontInter.variable,
            fontPlayfair.variable
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
            <div className="relative flex min-h-dvh flex-col pb-16 md:pb-0">
                <AppContent />
            </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
