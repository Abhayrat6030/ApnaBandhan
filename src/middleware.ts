
import { type NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';
import admin from 'firebase-admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// Initialize Firebase Admin SDK
try {
  initializeAdminApp();
} catch (e) {
  console.error('Middleware: Firebase Admin SDK initialization failed', e);
}

async function verifySession(sessionCookie: string | undefined) {
  if (!sessionCookie) {
    return null;
  }

  try {
    // Check if admin app is initialized
    if (admin.apps.length === 0) {
      console.error("Middleware: Firebase admin app is not initialized.");
      return null;
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Middleware: Error verifying session cookie:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  // If trying to access admin login page
  if (pathname.startsWith('/admin/login')) {
    const decodedClaims = await verifySession(sessionCookie);
    // If user is already a logged-in admin, redirect to dashboard
    if (decodedClaims && decodedClaims.email === ADMIN_EMAIL) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    // Otherwise, let them access the login page
    return NextResponse.next();
  }

  // For all other admin routes
  if (pathname.startsWith('/admin')) {
    const decodedClaims = await verifySession(sessionCookie);

    // If no valid session OR the user is not an admin, redirect to login
    if (!decodedClaims || decodedClaims.email !== ADMIN_EMAIL) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirectedFrom', pathname); // Optional: remember where they were going
      return NextResponse.redirect(url);
    }
  }

  // For all other routes, do nothing
  return NextResponse.next();
}

export const config = {
  // Match all admin routes except for the API routes used for login/logout
  matcher: ['/admin/:path*'],
};
