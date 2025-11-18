"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthAPI } from '@/utils/api';
import { getAuthRedirectPath, canAccessRoute, getUserStatusMessage } from '@/utils/auth-routing';
import { SimpleLoading } from '@/components/ui/simple-loading';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

export function AuthGuard({ children, requiredRole, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.replace('/');
        return;
      }

      const userData = await AuthAPI.me();
      setUser(userData);

      // Check role requirements
      if (requiredRole && userData.role !== requiredRole) {
        router.replace('/');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(userData.role)) {
        router.replace('/');
        return;
      }

      // Check if user can access current route
      const userStatus = {
        role: userData.role,
        is_verified: userData.is_verified,
        kyc_status: userData.kyc_status,
        subscription_status: userData.subscription_status,
        subscription_blocked: userData.subscription_blocked
      };

      if (!canAccessRoute(userStatus, pathname)) {
        const correctPath = getAuthRedirectPath(userStatus);
        router.replace(correctPath);
        return;
      }

      // Set status message for UI
      setStatusMessage(getUserStatusMessage(userStatus));
      setLoading(false);

    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.replace('/');
    }
  };

  if (loading) {
    return <SimpleLoading />;
  }

  return <>{children}</>;
}

export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredRole?: string; allowedRoles?: string[] }
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard requiredRole={options?.requiredRole} allowedRoles={options?.allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}