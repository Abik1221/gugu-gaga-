"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Coins, DollarSign, Target, Users } from "lucide-react";
import { StatCard, MiniStat } from "@/app/(dashboard)/dashboard/affiliate/_components/cards";
import { useAffiliateDashboardContext } from "@/app/(dashboard)/dashboard/affiliate/_context/affiliate-dashboard-context";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

export default function CommissionsListPage() {
  const { stats, dash } = useAffiliateDashboardContext();

  const statCards = useMemo(
    () => [
      {
        title: "Active referrals",
        value: stats.referrals.toLocaleString(),
        description: "Pharmacies you’ve successfully onboarded",
        icon: Users as LucideIcon,
      },
      {
        title: "Current commission",
        value: formatCurrency(stats.currentCommission),
        description: "Projected payout for this period",
        icon: Coins as LucideIcon,
      },
      {
        title: "Pending payouts",
        value: formatCurrency(stats.pendingPayout),
        description: "Awaiting review & processing",
        icon: DollarSign as LucideIcon,
      },
      {
        title: "Paid to date",
        value: formatCurrency(stats.paidPayout),
        description: "Total earnings transferred to you",
        icon: Target as LucideIcon,
      },
    ],
    [stats.currentCommission, stats.paidPayout, stats.pendingPayout, stats.referrals]
  );

  const tenantsCount = dash?.tenants?.length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <MiniStat label="Verified pharmacies" value={tenantsCount.toString()} />
        <MiniStat label="Current commission" value={formatCurrency(stats.currentCommission)} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map(({ title, value, description, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * index }}
          >
            <StatCard title={title} value={value} description={description} icon={<Icon className="h-5 w-5" />} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
