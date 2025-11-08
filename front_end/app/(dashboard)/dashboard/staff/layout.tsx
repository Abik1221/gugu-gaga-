"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/custom/staff-sidebar";
import { AuthAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await AuthAPI.me();
        // if (me?.role !== "cashier" && me?.role !== "staff") {
        //   router.replace("/dashboard");
        //   return;
        // }
        setUser(me);
      } catch (err) {
        // router.replace("/auth/login");
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

  if (!user) return null;

  return (
    <SidebarProvider>
      <StaffSidebar user={user} />
      <SidebarInset className="bg-white text-black">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
          <SidebarTrigger className="-ml-1 text-black" />
          <div className="flex-1">
            <h1 className="font-semibold text-black text-lg">
              Staff Dashboard
            </h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
