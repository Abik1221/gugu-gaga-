"use client";

import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AffiliateSidebar } from "./sidebar";
import { useAffiliateDashboardContext } from "../_context/affiliate-dashboard-context";

export function AffiliateLayoutShell({ children }: { children: React.ReactNode }) {
  const { loading, error, stats, payoutPercent, monthLabel } = useAffiliateDashboardContext();
  const pathname = usePathname();
  const isOverview = pathname === "/dashboard/affiliate";

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px),minmax(0,1fr)]">
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    isOverview ? (
      <div className="w-full">
        {children}
      </div>
    ) : (
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,280px),minmax(0,1fr)]">
        <AffiliateSidebar stats={stats} monthLabel={monthLabel} payoutPercent={payoutPercent} />
        <div className="space-y-8 pb-20">{children}</div>
      </div>
    )
  );
}
