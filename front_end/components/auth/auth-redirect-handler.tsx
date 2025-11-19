"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { getHardcodedRoute } from "@/utils/hardcoded-routing";

export function AuthRedirectHandler() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      const redirectPath = getHardcodedRoute(user);
      router.replace(redirectPath);
    }
  }, [user, loading, router]);

  return null;
}