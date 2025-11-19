"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getHardcodedRoute, canAccessRoute } from '@/utils/hardcoded-routing';
import { useAuth } from './auth-provider';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Public routes that don't need auth
    if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/register') || pathname.startsWith('/verify')) {
      setIsAuthorized(true);
      return;
    }

    if (!user) {
      // No user and trying to access protected route -> redirect to home
      if (pathname.startsWith('/dashboard')) {
        router.replace('/');
      } else {
        // Allow other public pages
        setIsAuthorized(true);
      }
      return;
    }

    // Check if user can access current route
    if (!canAccessRoute(user, pathname)) {
      const correctRoute = getHardcodedRoute(user);
      if (pathname !== correctRoute) {
        router.replace(correctRoute);
      }
      return;
    }

    setIsAuthorized(true);
  }, [pathname, user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}