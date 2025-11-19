"use client";

import { SupplierGuard } from "@/components/auth/role-guard";


export default function SupplierFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupplierGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </SupplierGuard>
  );
}