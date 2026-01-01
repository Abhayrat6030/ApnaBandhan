
import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_PATHS = ['/admin', '/api/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ADMIN_PATHS.some(path => pathname.startsWith(path));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  const sessionCookie = request.cookies.get('__session')?.value;

  // Handle API requests
  if (pathname.startsWith('/api/')) {
    if (!sessionCookie) {
      // For API routes, return a JSON error response instead of redirecting.
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // If cookie exists, let the request proceed. The API route itself will verify it.
    return NextResponse.next();
  }

  // Handle Page requests
  if (pathname.startsWith('/admin')) {
    // If it's a UI page and there's no cookie, redirect to login.
    // Exclude the login page itself to prevent a redirect loop.
    if (!sessionCookie && !pathname.startsWith('/admin/login')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Ensure the middleware runs on all admin paths.
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
