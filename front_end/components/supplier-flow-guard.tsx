"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupplierFlowStatus, getRedirectPath } from "@/utils/supplier-flow";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierFlowGuardProps {
  children: React.ReactNode;
}

export function SupplierFlowGuard({ children }: SupplierFlowGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      const flowStatus = await getSupplierFlowStatus();
      
      // Define allowed paths for each step
      const allowedPaths = {
        kyc_pending: ['/dashboard/supplier-kyc'],
        payment_pending: ['/dashboard/supplier-payment'],
        approved: ['/dashboard/supplier']
      };

      const currentAllowedPaths = allowedPaths[flowStatus.step] || [];
      
      // Check if current path is allowed for current step
      if (currentAllowedPaths.some(path => pathname.startsWith(path))) {
        setCanAccess(true);
      } else {
        // Redirect to appropriate step
        const redirectPath = getRedirectPath(flowStatus);
        router.replace(redirectPath);
      }
    } catch (error) {
      console.error('Error checking supplier flow:', error);
      router.replace('/dashboard/supplier-kyc');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
}