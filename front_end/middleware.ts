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
                     pathname.startsWith('/register') ||
                     pathname.startsWith('/verify');
  
  // Get token from cookies or headers
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.headers.get('x-access-token');
  
  // If accessing dashboard without token, redirect to appropriate login
  if (isDashboardRoute && !token) {
    const url = request.nextUrl.clone();
    
    // Block obvious admin routes - redirect to 404
    if (pathname.startsWith('/dashboard/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/404';
      return NextResponse.redirect(url);
    }
    
    // Determine login page based on dashboard type - check most specific paths first
    if (pathname.startsWith('/dashboard/supplier')) {
      url.pathname = '/supplier-signin';
    } else if (pathname.startsWith('/dashboard/affiliate')) {
      url.pathname = '/affiliate-signin';
    } else if (pathname.startsWith('/dashboard/owner') || pathname.startsWith('/dashboard/kyc') || pathname.startsWith('/dashboard/payment') || pathname.startsWith('/dashboard/inventory') || pathname.startsWith('/dashboard/pos') || pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/receipts') || pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/ai')) {
      url.pathname = '/owner-signin';
    } else {
      url.pathname = '/auth';
    }
    
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If accessing auth routes with token, redirect to appropriate dashboard
  if (isAuthRoute && token) {
    // Check if there's a specific redirect parameter
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    if (redirectParam && redirectParam.startsWith('/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = redirectParam;
      url.searchParams.delete('redirect');
      return NextResponse.redirect(url);
    }
    
    // Try to decode role from token (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      
      const roleRedirects: Record<string, string> = {
        admin: '/dashboard/admin',
        pharmacy_owner: '/dashboard/kyc', // Will be handled by flow logic
        affiliate: '/dashboard/affiliate',
        supplier: '/dashboard/supplier-kyc', // Will be handled by flow logic
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
    '/register/:path*',
    '/verify/:path*'
  ]
};