
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/admin';

export const runtime = 'nodejs';

// This guard is necessary for some environments.
export const unstable_allowDynamic = [
  '**/node_modules/firebase-admin/lib/app/credential-internal.js',
  '**/node_modules/firebase-admin/lib/app/firebase-namespace-internal.js',
];


async function verifySessionCookie(req: NextRequest) {
  const sessionCookie = req.cookies.get('__session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid.
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of paths that are protected and require admin access
  const adminPaths = ['/admin/dashboard', '/admin/orders', '/admin/services', '/admin/ai-enhancer'];

  if (adminPaths.some(path => pathname.startsWith(path))) {
    const decodedClaims = await verifySessionCookie(request);
    
    // If no valid session or the user is not an admin, redirect to admin login
    if (!decodedClaims || decodedClaims.email !== 'abhayrat603@gmail.com') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
