"use client";

import { SupplierGuard } from "@/components/auth/role-guard";
import { SupplierFlowGuard } from "@/components/supplier-flow-guard";

export default function SupplierFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupplierGuard>
      <SupplierFlowGuard>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </SupplierFlowGuard>
    </SupplierGuard>
  );
}