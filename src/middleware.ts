
import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';
const ADMIN_PATHS = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ADMIN_PATHS.some(path => pathname.startsWith(path));

  // If it's not a protected route, just continue
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, verify the session
  const verifyUrl = new URL('/api/auth/verify', request.url);

  const response = await fetch(verifyUrl, {
    headers: {
      Cookie: `__session=${sessionCookie || ''}`,
    },
  });

  const { isAdmin } = await response.json();

  if (!isAdmin) {
    // For API routes, return a JSON error
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }
    // For UI routes, redirect to the admin login page
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is an admin, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
