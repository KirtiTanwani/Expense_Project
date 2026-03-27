import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/admin', '/manager', '/employee'];
const publicRoutes = ['/login', '/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = req.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && session && path !== '/') {
    // If they have an old 'USER' cookie, wipe it out and let them stay on the public route
    if (session.role.toLowerCase() === 'user') {
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
    return NextResponse.redirect(new URL(`/${session.role.toLowerCase()}`, req.nextUrl));
  }
  
  // Role-based directory protection
  if (session) {
    const role = session.role.toLowerCase();
    
    // Admin can access everything except other dashboards if we want, but let's strictly route users to their hubs
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}`, req.nextUrl));
    }
    if (path.startsWith('/manager') && role !== 'manager') {
      return NextResponse.redirect(new URL(`/${role}`, req.nextUrl));
    }
    if (path.startsWith('/employee') && role !== 'employee') {
      return NextResponse.redirect(new URL(`/${role}`, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
