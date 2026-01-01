import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  const adminPaths = ['/admin/dashboard', '/admin/orders', '/admin/services', '/admin/ai-enhancer'];
  const isAuthPage = pathname === '/admin/login';

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
      
      const { user } = await response.json();

      if (!user || user.email !== 'abhayrat603@gmail.com') {
         throw new Error('Not an admin');
      }

    } catch (error) {
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
