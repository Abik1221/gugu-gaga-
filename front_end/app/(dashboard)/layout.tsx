"use client"

import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard redirectTo="/auth">
      {children}
    </AuthGuard>
  );
}
