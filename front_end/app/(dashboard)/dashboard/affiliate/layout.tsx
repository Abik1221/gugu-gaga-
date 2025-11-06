"use client";

import React from "react";
import { AffiliateDashboardProvider } from "./_context/affiliate-dashboard-context";

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AffiliateDashboardProvider>
      {children}
    </AffiliateDashboardProvider>
  );
}
