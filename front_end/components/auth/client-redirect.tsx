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
        // Redirect to appropriate login page
        if (path.includes('/dashboard/admin')) {
          router.replace('/superadin/zemnpharma/login');
        } else if (path.includes('/dashboard/owner')) {
          router.replace('/owner-signin');
        } else if (path.includes('/dashboard/affiliate')) {
          router.replace('/affiliate-signin');
        } else if (path.includes('/dashboard/supplier')) {
          router.replace('/supplier-signin');
        } else if (path.includes('/dashboard/staff')) {
          router.replace('/owner-signin');
        } else {
          router.replace('/auth');
        }
      }
    }
  }, [router]);

  return null;
}