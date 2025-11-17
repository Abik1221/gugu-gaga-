"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { type AuthProfile } from "@/utils/api";
import { getOwnerFlowStatus } from "@/utils/owner-flow";
import { getSupplierFlowStatus } from "@/utils/supplier-flow";
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

        // Handle role-specific flow checks
        await handleRoleSpecificFlow(user);
        
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

    async function handleRoleSpecificFlow(profile: AuthProfile) {
      const role = profile.role;
      
      // Owner flow check
      if (role === "pharmacy_owner") {
        const flowStatus = await getOwnerFlowStatus();
        
        // Allow access to flow pages
        const flowPages = ["/dashboard/kyc", "/dashboard/payment"];
        const isOnFlowPage = flowPages.some(page => pathname.startsWith(page));
        
        if (flowStatus === "kyc_pending" && !pathname.startsWith("/dashboard/kyc")) {
          router.replace("/dashboard/kyc");
          return;
        }
        
        if (flowStatus === "payment_pending" && !pathname.startsWith("/dashboard/payment")) {
          router.replace("/dashboard/payment");
          return;
        }
        
        // If approved but on flow page, redirect to dashboard
        if (flowStatus === "approved" && isOnFlowPage) {
          router.replace("/dashboard/owner");
          return;
        }
      }
      
      // Supplier flow check
      if (role === "supplier") {
        const flowStatus = await getSupplierFlowStatus();
        
        const flowPages = ["/dashboard/supplier-kyc", "/dashboard/supplier-payment"];
        const isOnFlowPage = flowPages.some(page => pathname.startsWith(page));
        
        if (!flowStatus.can_access_dashboard && !isOnFlowPage) {
          if (flowStatus.step === "kyc_pending") {
            router.replace("/dashboard/supplier-kyc");
            return;
          }
          if (flowStatus.step === "payment_pending") {
            router.replace("/dashboard/supplier-payment");
            return;
          }
        }
        
        // If approved but on flow page, redirect to dashboard
        if (flowStatus.can_access_dashboard && isOnFlowPage) {
          router.replace("/dashboard/supplier");
          return;
        }
      }
      
      // Affiliate verification check
      if (role === "affiliate") {
        // Check if affiliate is verified/approved
        if (profile.kyc_status && profile.kyc_status !== "approved") {
          // Could redirect to affiliate verification page if needed
          console.warn("Affiliate not fully approved:", profile.kyc_status);
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