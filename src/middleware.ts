
import { type NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude the login page itself to prevent a redirect loop.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }
  
  const sessionCookie = request.cookies.get('__session')?.value;

  // If it's an API request and there's no session, return a JSON error.
  if (pathname.startsWith('/api/')) {
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  // If it's a UI page request and there's no session, redirect to login.
  else if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// This matcher ensures the middleware runs on all admin-related paths,
// including UI pages and all relevant API routes for auth and admin actions.
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/auth/:path*'],
};
