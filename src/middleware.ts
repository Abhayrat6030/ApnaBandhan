
import { type NextRequest, NextResponse } from 'next/server';

// This middleware is now responsible ONLY for redirecting unauthenticated users
// from protected admin pages to the login page. It no longer performs session
// verification itself, which was causing the edge runtime issues.

const ADMIN_EMAIL = 'abhayrat603@gmail.com';
const ADMIN_PATHS = ['/admin', '/api/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ADMIN_PATHS.some(path => pathname.startsWith(path));

  // If it's not a protected route, do nothing.
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // If the user is trying to access the login page, let them through.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }
  
  // If it IS a protected route, check for the session cookie.
  const sessionCookie = request.cookies.get('__session')?.value;

  // If there's no session cookie and the user is trying to access a protected UI page,
  // redirect them to the admin login page.
  if (!sessionCookie && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If there's no session cookie for a protected API route, the API route itself
  // will handle the "Unauthorized" response. This is more secure and reliable.
  // If the cookie IS present, we let the request proceed. The API route will
  // be responsible for verifying its validity.

  return NextResponse.next();
}

// Ensure the middleware runs on all admin and admin-api paths.
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
