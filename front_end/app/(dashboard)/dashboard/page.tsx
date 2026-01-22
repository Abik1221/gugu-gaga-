"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthAPI } from "@/utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await AuthAPI.me();

        // Redirect based on user role
        switch (user?.role) {
          case "admin":
            router.replace("/dashboard/admin");
            break;
          case "pharmacy_owner":
            router.replace("/dashboard/owner");
            break;
          case "cashier":
          case "staff":
            router.replace("/dashboard/staff");
            break;
          case "affiliate":
            router.replace("/dashboard/affiliate");
            break;

          default:
            router.replace("/dashboard/owner");
        }
      } catch (err) {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-32 w-64" />
      </div>
    );
  }

  return null;
}
