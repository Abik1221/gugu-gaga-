"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAPI } from "@/utils/api";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.replace("/superadin/zeenpharma/login");
          return;
        }

        const user = await AuthAPI.me();
        if (user.role !== "admin") {
          router.replace("/superadin/zeenpharma/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.replace("/superadin/zeenpharma/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}