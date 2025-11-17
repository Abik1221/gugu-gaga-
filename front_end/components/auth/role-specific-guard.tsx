"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleSpecificGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleSpecificGuard({ 
  children, 
  allowedRoles, 
  redirectTo = "/dashboard" 
}: RoleSpecificGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (!user.is_verified) {
      router.replace("/verify");
      return;
    }

    if (!allowedRoles.includes(user.role || "")) {
      // Redirect to appropriate dashboard based on role
      const roleRedirects: Record<string, string> = {
        admin: "/dashboard/admin",
        pharmacy_owner: "/dashboard/owner",
        affiliate: "/dashboard/affiliate",
        supplier: "/dashboard/supplier",
        cashier: "/dashboard/staff"
      };
      
      const userRedirect = roleRedirects[user.role || ""] || redirectTo;
      router.replace(userRedirect);
      return;
    }

    // Additional checks for specific roles
    if (user.role === "pharmacy_owner") {
      if (user.kyc_status !== "approved") {
        router.replace("/dashboard/kyc");
        return;
      }
      if (user.subscription_status !== "active") {
        router.replace("/dashboard/payment");
        return;
      }
    }

    if (user.role === "supplier") {
      if (user.kyc_status !== "approved") {
        router.replace("/dashboard/supplier-kyc");
        return;
      }
      if (user.subscription_status !== "active") {
        router.replace("/dashboard/supplier-payment");
        return;
      }
    }
  }, [user, loading, router, allowedRoles, redirectTo]);

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

  if (!user || !user.is_verified || !allowedRoles.includes(user.role || "")) {
    return null;
  }

  return <>{children}</>;
}