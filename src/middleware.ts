
import { type NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';
import admin from 'firebase-admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// This makes the middleware run on the Node.js runtime, which is required by firebase-admin.
export const runtime = 'nodejs';

// Initialize Firebase Admin SDK using the centralized function
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
    // Check if the app is initialized before verifying the cookie
    if (admin.apps.length === 0) {
      initializeAdminApp();
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid or expired.
    console.error('Error verifying session cookie in middleware:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // For /admin/login, we don't need to verify the session yet
  if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
  }
  
  // For all other admin and API routes, verify the session
  const decodedClaims = await verifySession(sessionCookie);
  const isAdmin = decodedClaims?.email === ADMIN_EMAIL;

  // If user is NOT an admin...
  if (!isAdmin) {
    // and they are trying to access any protected admin route (UI or API),
    // redirect them to the admin login page or return an error for API routes.
    if (pathname.startsWith('/admin/')) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(url);
    }
    // Protect API routes as well
    if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }
    // Allow POST to /api/auth/session for login, but protect other methods
    if (pathname.startsWith('/api/auth/session') && request.method !== 'POST') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // If we reach here, the user is an admin or the route is not protected, so allow the request.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/auth/session'],
};
