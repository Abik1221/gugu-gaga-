"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

function AuthRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const redirectPath = searchParams.get('redirect');
    
    if (user && user.is_verified) {
      // User is authenticated and verified, redirect to appropriate dashboard
      if (redirectPath && redirectPath.startsWith('/dashboard')) {
        // Check if user has access to the requested path
        const roleAccess: Record<string, string[]> = {
          '/dashboard/admin': ['admin'],
          '/dashboard/owner': ['pharmacy_owner'],
          '/dashboard/affiliate': ['affiliate'],
          '/dashboard/supplier': ['supplier'],
          '/dashboard/staff': ['cashier']
        };

        const requiredRoles = roleAccess[redirectPath];
        if (requiredRoles && requiredRoles.includes(user.role || '')) {
          router.replace(redirectPath);
          return;
        }
      }

      // Default redirect based on role
      const roleRedirects: Record<string, string> = {
        admin: '/dashboard/admin',
        pharmacy_owner: '/dashboard/owner',
        affiliate: '/dashboard/affiliate',
        supplier: '/dashboard/supplier',
        cashier: '/dashboard/staff'
      };

      const defaultPath = roleRedirects[user.role || ''] || '/dashboard';
      router.replace(defaultPath);
    }
  }, [user, loading, router, searchParams]);

  return null;
}

export function AuthRedirectHandler() {
  return <AuthRedirectContent />;
}