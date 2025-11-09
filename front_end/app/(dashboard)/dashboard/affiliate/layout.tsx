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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        router.push('/affiliate-signin');
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser({ name: data.email.split('@')[0], email: data.email, tenant_id: data.tenant_id });
        } else {
          router.push('/affiliate-signin');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/affiliate-signin');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  }

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