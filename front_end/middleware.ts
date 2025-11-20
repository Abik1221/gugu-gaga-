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

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // Check for authentication token in cookies
    const accessToken = request.cookies.get('access_token')?.value

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
