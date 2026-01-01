
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session');
  const { pathname } = request.nextUrl;

  // If the user is trying to access the login page, let them through.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // If there's no session cookie, redirect to the login page.
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // If there is a session cookie, let the request proceed.
  // The actual verification of the cookie will happen in the API route or Server Component.
  return NextResponse.next();
}
