import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
    '/dashboard/affiliate',
    '/dashboard/owner',
    '/dashboard/supplier',
    '/dashboard/admin',
    '/dashboard/staff',
]

// Public routes that don't require authentication
const publicRoutes = [
    '/affiliate-signin',
    '/owner-signin',
    '/supplier-signin',
    '/auth',
    '/',
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Redirect old admin routes to home
    if (pathname.startsWith('/superadin')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Check for authentication token in cookies
    const accessToken = request.cookies.get('access_token')?.value

    // Redirect logged-in users from landing page to dashboard
    // UNLESS they explicitly clicked "Back to Home" (indicated by allow_homepage cookie)
    if (pathname === '/' && accessToken) {
        const allowHomepage = request.cookies.get('allow_homepage')?.value;

        if (!allowHomepage) {
            // No cookie = direct access, redirect to dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Cookie present = explicit navigation, allow homepage visit
        // Clear the cookie so next direct access will redirect again
        const response = NextResponse.next();
        response.cookies.delete('allow_homepage');
        return response;
    }

    if (!isProtectedRoute) {
        return NextResponse.next()
    }



    // If no token, redirect to appropriate login page
    if (!accessToken) {
        let loginPath = '/auth/login'

        // Redirect to role-specific login pages
        if (pathname.startsWith('/dashboard/affiliate')) {
            loginPath = '/affiliate-signin'
        } else if (pathname.startsWith('/dashboard/owner')) {
            loginPath = '/owner-signin'
        } else if (pathname.startsWith('/dashboard/supplier')) {
            loginPath = '/supplier-signin'
        }

        const url = new URL(loginPath, request.url)
        // Add the intended destination as a redirect parameter
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Configure which routes should be processed by this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico|json)).*)',
    ],
}
