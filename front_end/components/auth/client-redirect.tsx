"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is trying to access dashboard without auth
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Redirect to appropriate login page - check most specific paths first
        if (path.startsWith('/dashboard/supplier-kyc') || path.startsWith('/dashboard/supplier-payment') || path.startsWith('/dashboard/supplier-status') || path.startsWith('/dashboard/supplier')) {
          router.replace('/supplier-signin');
        } else if (path.startsWith('/dashboard/affiliate')) {
          router.replace('/affiliate-signin');
        } else if (path.startsWith('/dashboard/owner') || path.startsWith('/dashboard/kyc') || path.startsWith('/dashboard/payment') || path.startsWith('/dashboard/inventory') || path.startsWith('/dashboard/pos') || path.startsWith('/dashboard/settings') || path.startsWith('/dashboard/receipts')) {
          router.replace('/owner-signin');
        } else if (path.startsWith('/dashboard/admin')) {
          router.replace('/superadin/zemnpharma/login');
        } else if (path.startsWith('/dashboard/staff')) {
          router.replace('/owner-signin');
        } else if (path.startsWith('/dashboard/ai')) {
          router.replace('/owner-signin');
        } else {
          router.replace('/auth');
        }
      }
    }
  }, [router]);

  return null;
}