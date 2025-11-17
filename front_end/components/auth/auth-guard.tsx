"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { type AuthProfile } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Clear any stale cookies
      if (typeof window !== "undefined") {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      
      // Determine redirect based on current path if not specified
      let finalRedirect = redirectTo;
      if (!finalRedirect && typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.includes('/dashboard/admin')) {
          finalRedirect = '/superadin/zemnpharma/login';
        } else if (path.includes('/dashboard/owner')) {
          finalRedirect = '/owner-signin';
        } else if (path.includes('/dashboard/affiliate')) {
          finalRedirect = '/affiliate-signin';
        } else if (path.includes('/dashboard/supplier')) {
          finalRedirect = '/supplier-signin';
        } else if (path.includes('/dashboard/staff')) {
          finalRedirect = '/owner-signin';
        } else {
          finalRedirect = '/auth';
        }
      }
      
      router.replace(finalRedirect || '/auth');
      return;
    }

    // Verify user is verified and approved
    if (!user.is_verified) {
      router.replace("/verify");
      return;
    }

    // Check role if required
    if (requiredRole && user.role !== requiredRole) {
      // Redirect based on user role
      const roleRedirects: Record<string, string> = {
        admin: "/dashboard/admin",
        pharmacy_owner: "/dashboard/owner",
        affiliate: "/dashboard/affiliate", 
        supplier: "/dashboard/supplier",
        cashier: "/dashboard/staff"
      };
      
      const userRedirect = roleRedirects[user.role || ""] || "/dashboard";
      router.replace(userRedirect);
      return;
    }
  }, [user, loading, router, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Keep the useAuthUser hook for backward compatibility
export function useAuthUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}