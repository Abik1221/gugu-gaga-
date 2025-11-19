"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { type AuthProfile } from "@/utils/api";
import { getHardcodedRoute, canAccessRoute } from "@/utils/hardcoded-routing";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo = "/auth" 
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [flowLoading, setFlowLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      if (loading) return;
      
      setFlowLoading(true);
      
      try {
        if (!user) {
          router.replace(redirectTo);
          return;
        }

        // Check if user role is allowed
        if (!allowedRoles.includes(user.role || "")) {
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

        // Check if user can access current route
        if (!canAccessRoute(user, pathname)) {
          const correctRoute = getHardcodedRoute(user);
          router.replace(correctRoute);
          return;
        }
        
        if (mounted) {
          setAuthorized(true);
        }
      } catch (err: any) {
        if (!mounted) return;
        
        console.error("[RoleGuard] Flow check failed:", err);
        router.replace(redirectTo);
      } finally {
        if (mounted) {
          setFlowLoading(false);
        }
      }
    }



    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, loading, router, allowedRoles, redirectTo, pathname]);

  if (loading || flowLoading) {
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

  if (!authorized || !user) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function OwnerGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["pharmacy_owner"]} redirectTo="/owner-signin">
      {children}
    </RoleGuard>
  );
}

export function AffiliateGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["affiliate"]} redirectTo="/affiliate-signin">
      {children}
    </RoleGuard>
  );
}

export function SupplierGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["supplier"]} redirectTo="/supplier-signin">
      {children}
    </RoleGuard>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo="/superadin/zeenpharma/login">
      {children}
    </RoleGuard>
  );
}

export function StaffGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["cashier"]} redirectTo="/auth">
      {children}
    </RoleGuard>
  );
}