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
    // The verification of the cookie's validity and admin status
    // will now be handled within each server action via verifyAdmin().
    // This makes the middleware simpler and more efficient.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
