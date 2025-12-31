import type { Metadata } from 'next';
import { Poppins, Cormorant_Garamond } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const fontCormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ApnaBandhan | Wedding Invitations • Videos • Albums',
  description: 'Complete Wedding Invitation, Video & Album Solution. Professional and affordable wedding services for your special day.',
  keywords: 'indian wedding invitations, wedding videos, wedding albums, save the date video, e-invites, ApnaBandhan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontCormorant.variable,
          fontPoppins.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingWhatsApp />
        <Toaster />
      </body>
    </html>
  );
}
