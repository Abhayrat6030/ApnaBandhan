
'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
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
  const isHomePage = pathname === '/';
  const isAdminRoute = pathname.startsWith('/admin');

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
          fontInter.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          {!isAdminRoute && <Header />}
          <main className="flex-1">{children}</main>
          {!isAdminRoute && <Footer isHomePage={isHomePage} />}
        </div>
        {!isAdminRoute && <FloatingWhatsApp />}
        <Toaster />
      </body>
    </html>
  );
}
