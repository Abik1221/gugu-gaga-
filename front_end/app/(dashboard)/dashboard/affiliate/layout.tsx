"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Home, BarChart3, Users, Settings, FileText, Package, LayoutDashboard, LinkIcon, Coins, DollarSign, Activity, LogOut } from "lucide-react";
import { AffiliateGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";
import Loading from './loading';
import { AffiliateDashboardProvider } from "./_context/affiliate-dashboard-context";

// Navigation configuration
const navigation = [
  { href: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: <LayoutDashboard /> },
  { href: "/dashboard/affiliate/generate-link", label: "Generate Link", icon: <LinkIcon /> },
  { href: "/dashboard/affiliate/commissions", label: "Commissions", icon: <Coins /> },
  { href: "/dashboard/affiliate/payouts", label: "Payouts", icon: <DollarSign /> },
];

export default function AffiliateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push("/affiliate-signin");
  };

  const navigationWithSignOut = [
    ...navigation,
    { href: "#", label: "Sign out", icon: <LogOut />, onClick: handleSignOut }
  ];

  return (
    <AffiliateGuard>
      <AffiliateDashboardProvider>
        <Layout
          nav={navigationWithSignOut}
          pathname={pathname}
          user={{
            name: user?.first_name || user?.username || user?.email || "Affiliate",
            email: user?.email || "",
            tenant_id: user?.tenant_id || "",
          }}
          isAffiliate={true}
          isAdmin={false}
        >
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Layout>
      </AffiliateDashboardProvider>
    </AffiliateGuard>
  );
}