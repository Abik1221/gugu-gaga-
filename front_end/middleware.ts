import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected dashboard routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth') || 
                     pathname.startsWith('/owner-signin') || 
                     pathname.startsWith('/affiliate-signin') || 
                     pathname.startsWith('/supplier-signin') ||
                     pathname.startsWith('/superadin') ||
                     pathname.startsWith('/register');
  
  // Get token from cookies or headers
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.headers.get('x-access-token');
  
  // If accessing dashboard without token, redirect to appropriate login
  if (isDashboardRoute && !token) {
    const url = request.nextUrl.clone();
    
    // Determine login page based on dashboard type
    if (pathname.includes('/dashboard/admin')) {
      url.pathname = '/superadin/zemnpharma/login';
    } else if (pathname.includes('/dashboard/owner')) {
      url.pathname = '/owner-signin';
    } else if (pathname.includes('/dashboard/affiliate')) {
      url.pathname = '/affiliate-signin';
    } else if (pathname.includes('/dashboard/supplier')) {
      url.pathname = '/supplier-signin';
    } else if (pathname.includes('/dashboard/staff')) {
      url.pathname = '/owner-signin'; // Staff login through owner
    } else {
      // Default to auth page for generic dashboard access
      url.pathname = '/auth';
    }
    
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If accessing auth routes with token, redirect to appropriate dashboard
  if (isAuthRoute && token) {
    // Try to decode role from token (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      
      const roleRedirects: Record<string, string> = {
        admin: '/dashboard/admin',
        pharmacy_owner: '/dashboard/owner',
        affiliate: '/dashboard/affiliate',
        supplier: '/dashboard/supplier',
        cashier: '/dashboard/staff'
      };
      
      const redirectPath = roleRedirects[role] || '/dashboard';
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return NextResponse.redirect(url);
    } catch {
      // Invalid token, continue to auth
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/owner-signin/:path*',
    '/affiliate-signin/:path*',
    '/supplier-signin/:path*',
    '/superadin/:path*',
    '/register/:path*'
  ]
};