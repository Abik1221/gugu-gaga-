"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't redirect if we're on auth pages that handle their own redirects
  const isAuthPage = pathname?.includes('/verify') || pathname?.includes('/signin') || pathname?.includes('/register');
  
  // Always check flow status for owners and suppliers on dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard');

  useEffect(() => {
    if (loading || isAuthPage) return;

    if (user) {
      // Handle pharmacy owners with flow logic - always check on dashboard pages
      if (user.role === "pharmacy_owner" && isDashboardPage) {
        import("@/utils/owner-flow").then(async ({ getOwnerFlowStatus, getRedirectPath }) => {
          try {
            const status = await getOwnerFlowStatus();
            const redirectPath = getRedirectPath(status);
            if (pathname !== redirectPath) {
              router.replace(redirectPath);
            }
          } catch (error) {
            if (pathname !== "/dashboard/kyc") {
              router.replace("/dashboard/kyc");
            }
          }
        });
        return;
      }

      // Handle suppliers with flow logic - always check on dashboard pages
      if (user.role === "supplier" && isDashboardPage) {
        import("@/utils/supplier-flow").then(async ({ getSupplierFlowStatus, getRedirectPath }) => {
          try {
            const status = await getSupplierFlowStatus();
            const redirectPath = getRedirectPath(status);
            if (pathname !== redirectPath) {
              router.replace(redirectPath);
            }
          } catch (error) {
            if (pathname !== "/dashboard/supplier-kyc") {
              router.replace("/dashboard/supplier-kyc");
            }
          }
        });
        return;
      }

      // Redirect other roles to their appropriate dashboard (only if not already there)
      if (!isDashboardPage) {
        const roleRedirects: Record<string, string> = {
          admin: "/dashboard/admin",
          affiliate: "/dashboard/affiliate",
          cashier: "/dashboard/staff"
        };

        const redirect = roleRedirects[user.role || ""] || "/dashboard";
        router.replace(redirect);
      }
    }
  }, [user, loading, router, isAuthPage, isDashboardPage, pathname]);

  // Show login form only if user is not authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && !isAuthPage) {
    return null; // Will redirect
  }

  return <>{children}</>;
}