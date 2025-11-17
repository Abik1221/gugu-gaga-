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
        router.replace('/auth');
      }
    }
  }, [router]);

  return null;
}