"use client";

import { SupplierFlowGuard } from "@/components/supplier-flow-guard";

export default function SupplierFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupplierFlowGuard>
      <div className="min-h-screen bg-gray-50">
        {/* <div className="container mx-auto px-4 py-8"> */}
          {children}
        {/* </div> */}
      </div>
    </SupplierFlowGuard>
  );
}