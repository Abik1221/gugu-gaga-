"use client";

import React from "react";
import { AffiliateDashboardProvider } from "./_context/affiliate-dashboard-context";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { DashboardContent } from "@/components/DashboardContent";
import { Home, BarChart3, Users, Settings, FileText, Package, LayoutDashboard, LinkIcon, Coins, DollarSign, Activity, LogOut } from "lucide-react";

// Navigation configuration
const navigation = [{ href: "/dashboard/affiliate", label: "Affiliate Dashboard", icon: <LayoutDashboard /> },
{ href: "/dashboard/affiliate/generate-link", label: "Generate Link", icon: <LinkIcon /> },
{ href: "/dashboard/affiliate/commissions", label: "Commissions", icon: <Coins /> },
{ href: "/dashboard/affiliate/payouts", label: "Payouts", icon: <DollarSign /> },
{ href: "/signout", label: "Sign out", icon: <LogOut /> }
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
  const [currentPath] = useState("/dashboard");

  return (
    <Layout
      nav={navigation}
      pathname={currentPath}
      user={mockUser}
      isAffiliate={false}
      isAdmin={false}
    >
      {/* <DashboardContent /> */}
      <AffiliateDashboardProvider>
        {children}

      </AffiliateDashboardProvider>
    </Layout>
  );
}