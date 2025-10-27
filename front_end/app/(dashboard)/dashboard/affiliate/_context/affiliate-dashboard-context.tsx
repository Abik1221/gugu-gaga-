"use client";

import React, { createContext, useContext } from "react";
import {
  useAffiliateDashboard,
  type AffiliateLink,
  type AffiliateStats,
  type AffiliateDashboardSummary,
} from "../_hooks/use-affiliate-dashboard";

const AffiliateDashboardContext = createContext<ReturnType<typeof useAffiliateDashboard> | null>(null);

export function AffiliateDashboardProvider({ children }: { children: React.ReactNode }) {
  const value = useAffiliateDashboard();
  return <AffiliateDashboardContext.Provider value={value}>{children}</AffiliateDashboardContext.Provider>;
}

export function useAffiliateDashboardContext() {
  const context = useContext(AffiliateDashboardContext);
  if (!context) {
    throw new Error("useAffiliateDashboardContext must be used within AffiliateDashboardProvider");
  }
  return context;
}

export type { AffiliateStats, AffiliateLink, AffiliateDashboardSummary };
