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

    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Cookie: `__session=${sessionCookie}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const { isAdmin } = await response.json();

      if (!isAdmin) {
         throw new Error('Not an admin');
      }

    } catch (error) {
       const url = request.nextUrl.clone();
       url.pathname = '/admin/login';
       // Clear the invalid cookie
       url.cookies.delete('__session');
       const response = NextResponse.redirect(url);
       response.cookies.delete('__session');
       return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
