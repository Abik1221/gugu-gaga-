"use client";

import React, { Suspense } from "react";
import { AffiliateDashboardProvider } from "./_context/affiliate-dashboard-context";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { DashboardContent } from "@/components/DashboardContent";
import { Home, BarChart3, Users, Settings, FileText, Package, LayoutDashboard, LinkIcon, Coins, DollarSign, Activity, LogOut } from "lucide-react";
import Loading from '@/app/\(dashboard\)/dashboard/affiliate/loading';

// Navigation configuration
const navigation = [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: <LayoutDashboard /> },
{ href: "/dashboard/affiliate/generate-link", label: "Generate Link", icon: <LinkIcon /> },
{ href: "/dashboard/affiliate/commissions", label: "Commissions", icon: <Coins /> },
{ href: "/dashboard/affiliate/payouts", label: "Payouts", icon: <DollarSign /> },
{ href: "/affiliate-signin", label: "Sign out", icon: <LogOut /> }
];

// Mock user data - replace with real auth data
const mockUser = {
  name: "John Doe",
  email: "john@mesobai.com",
  tenant_id: "TENANT-001",
};

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState(mockUser);
  const [loading, setLoading] = React.useState(false);

  return (
    <Layout
      nav={navigation}
      pathname={pathname}
      user={user}
      isAffiliate={true}
      isAdmin={false}
    >
      {/* <DashboardContent /> */}
      <Suspense fallback={<Loading />}>
      <AffiliateDashboardProvider>
        {children}

      </AffiliateDashboardProvider>
      </Suspense>
    </Layout>
  );
}