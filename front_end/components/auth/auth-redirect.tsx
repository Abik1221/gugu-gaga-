"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Handle pharmacy owners with flow logic
      if (user.role === "pharmacy_owner") {
        import("@/utils/owner-flow").then(async ({ getOwnerFlowStatus, getRedirectPath }) => {
          try {
            const status = await getOwnerFlowStatus();
            const redirectPath = getRedirectPath(status);
            router.replace(redirectPath);
          } catch (error) {
            router.replace("/dashboard/kyc");
          }
        });
        return;
      }

      // Redirect other roles to their appropriate dashboard
      const roleRedirects: Record<string, string> = {
        admin: "/dashboard/admin",
        affiliate: "/dashboard/affiliate",
        supplier: "/dashboard/supplier",
        cashier: "/dashboard/staff"
      };

      const redirect = roleRedirects[user.role || ""] || "/dashboard";
      router.replace(redirect);
    }
  }, [user, loading, router]);

  // Show login form only if user is not authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}