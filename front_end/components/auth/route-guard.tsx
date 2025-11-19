"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthAPI } from '@/utils/api';
import { getHardcodedRoute, canAccessRoute } from '@/utils/hardcoded-routing';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // No token, redirect to home unless on public pages
        if (pathname.startsWith('/dashboard') || pathname === '/verify') {
          router.replace('/');
        }
        setIsChecking(false);
        return;
      }

      const userData = await AuthAPI.me();
      setUser(userData);

      // Check if user can access current route
      if (!canAccessRoute(userData, pathname)) {
        const correctRoute = getHardcodedRoute(userData);
        router.replace(correctRoute);
        return;
      }

      setIsChecking(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Redirect to home unless on public pages
      if (pathname.startsWith('/dashboard') || pathname === '/verify') {
        router.replace('/');
      }
      setIsChecking(false);
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}