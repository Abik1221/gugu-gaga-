"use client";

import React, { Suspense, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { DashboardContent } from "@/components/DashboardContent";
import { Home, BarChart3, Users, Settings, FileText, Package, LayoutDashboard, LinkIcon, Coins, DollarSign, Activity, LogOut } from "lucide-react";
import Loading from './loading';
import { AffiliateDashboardProvider } from "./_context/affiliate-dashboard-context";
import { AuthAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

// Navigation configuration
const navigation = [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: <LayoutDashboard /> },
{ href: "/dashboard/affiliate/generate-link", label: "Generate Link", icon: <LinkIcon /> },
{ href: "/dashboard/affiliate/commissions", label: "Commissions", icon: <Coins /> },
{ href: "/dashboard/affiliate/payouts", label: "Payouts", icon: <DollarSign /> },
{ href: "/affiliate-signin", label: "Sign out", icon: <LogOut /> }
];

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await AuthAPI.me();

        // Verify user is an affiliate
        if (me?.role !== "affiliate") {
          router.replace("/dashboard");
          return;
        }

        setUser(me);
      } catch (err) {
        // Not authenticated, redirect to affiliate sign-in
        router.replace("/affiliate-signin");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

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

  if (!user) {
    return null;
  }

  return (
    <AffiliateDashboardProvider>
      <Layout
        nav={navigation}
        pathname={pathname}
        user={user}
        isAffiliate={true}
        isAdmin={false}
      >
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </Layout>
    </AffiliateDashboardProvider>
  );
}