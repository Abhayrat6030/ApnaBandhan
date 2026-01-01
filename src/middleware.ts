
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
    if (admin.apps.length === 0) {
      console.error("Middleware: Firebase admin app is not initialized.");
      return null;
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid or expired.
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const decodedClaims = await verifySession(sessionCookie);
  const isAdmin = decodedClaims?.email === ADMIN_EMAIL;
  const { pathname } = request.nextUrl;

  // If user is an authenticated admin...
  if (isAdmin) {
    // and they are trying to access the login page, redirect to dashboard.
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Otherwise, allow them to proceed.
    return NextResponse.next();
  }

  // If user is NOT an admin...
  // and they are trying to access any protected admin route (UI or API),
  // redirect them to the admin login page.
  if (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login')) {
     const url = new URL('/admin/login', request.url);
     url.searchParams.set('redirectedFrom', pathname);
     return NextResponse.redirect(url);
  }
  
  if (pathname.startsWith('/api/admin/') || pathname.startsWith('/api/auth/session')) {
      if(pathname === '/api/auth/session' && request.method === 'POST') {
          // Allow login attempts to proceed to the API route to be verified.
          return NextResponse.next();
      }
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For all other cases, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  // Protect all admin UI and API routes, except the login page itself.
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/auth/session'],
};
