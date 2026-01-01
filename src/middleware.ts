import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  const adminPaths = ['/admin/dashboard', '/admin/orders', '/admin/services', '/admin/ai-enhancer'];

  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    // The actual verification of the cookie's validity and admin role
    // should be done in a server context (API Route, Server Action, etc.)
    // This middleware just gates access based on the presence of the cookie.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
