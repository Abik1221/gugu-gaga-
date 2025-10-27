"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AffiliateAPI } from "@/utils/api";
import { useToast } from "@/components/ui/toast";

export type AffiliateStats = {
  currentCommission: number;
  pendingPayout: number;
  paidPayout: number;
  referrals: number;
};

export type AffiliateLink = {
  token: string;
  url: string;
  active: boolean;
  createdAt?: string | null;
};

export type AffiliateDashboardSummary = {
  percent?: number;
  amount?: number;
  tenants?: string[];
  [key: string]: unknown;
};

type DashboardState = {
  loading: boolean;
  error: string | null;
  stats: AffiliateStats;
  dash: AffiliateDashboardSummary | null;
  links: AffiliateLink[];
  canCreateMore: boolean;
  monthLabel: string;
  payoutMonth: string;
  payoutPercent: number;
  requestingPayout: boolean;
  setPayoutMonth: (value: string) => void;
  setPayoutPercent: (value: number) => void;
  actions: {
    refresh: () => Promise<void>;
    createLink: () => Promise<void>;
    deactivate: (token: string) => Promise<void>;
    rotate: (token: string) => Promise<void>;
    copyLink: (url: string) => Promise<void>;
    requestPayout: () => Promise<void>;
  };
};

const DEFAULT_STATS: AffiliateStats = {
  currentCommission: 0,
  pendingPayout: 0,
  paidPayout: 0,
  referrals: 0,
};

const DEFAULT_MONTH = new Date().toISOString().slice(0, 7);
const MAX_ACTIVE_LINKS = 2;

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractStats(data: any): AffiliateStats {
  const source = data?.stats ?? data ?? {};
  return {
    currentCommission:
      toNumber(source.currentCommission ?? source.current_commission ?? source.current ?? 0),
    pendingPayout: toNumber(source.pendingPayout ?? source.pending_payout ?? 0),
    paidPayout: toNumber(source.paidPayout ?? source.paid_payout ?? source.paid ?? 0),
    referrals: toNumber(source.referrals ?? source.total_referrals ?? source.affiliates ?? 0),
  };
}

function normalizeLinks(payload: any): AffiliateLink[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.links)
    ? payload.links
    : [];

  return list
    .map((item: any) => ({
      token: String(item?.token ?? item?.code ?? ""),
      url: String(item?.url ?? item?.link ?? item?.register_url ?? ""),
      active: Boolean(item?.active ?? item?.is_active ?? item?.status === "active"),
      createdAt: item?.created_at ?? item?.createdAt ?? null,
    }))
    .filter((item: AffiliateLink) => item.token && item.url);
}

function extractMonthLabel(data: any): string {
  const month =
    data?.monthLabel ??
    data?.month_label ??
    data?.current_month_label ??
    data?.stats?.month_label ??
    null;
  if (month) return String(month);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
}

function extractPercent(data: any): number {
  return toNumber(
    data?.percent ??
      data?.commission_percent ??
      data?.stats?.percent ??
      data?.current_percent ??
      5
  );
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unexpected error";
  }
}

export function useAffiliateDashboard(): DashboardState {
  const { show } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AffiliateStats>(DEFAULT_STATS);
  const [dash, setDash] = useState<AffiliateDashboardSummary | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [canCreateMore, setCanCreateMore] = useState<boolean>(true);
  const [monthLabel, setMonthLabel] = useState<string>(extractMonthLabel(null));
  const [payoutMonth, setPayoutMonthState] = useState<string>(DEFAULT_MONTH);
  const [payoutPercent, setPayoutPercentState] = useState<number>(5);
  const [requestingPayout, setRequestingPayout] = useState<boolean>(false);

  const hasInitialized = useRef(false);

  const refreshLinks = useCallback(async () => {
    const response = await AffiliateAPI.getLinks();
    const normalized = normalizeLinks(response);
    setLinks(normalized);
    const activeCount = normalized.filter((link) => link.active).length;
    setCanCreateMore(activeCount < MAX_ACTIVE_LINKS);
  }, []);

  const refreshDashboard = useCallback(async () => {
    const response = await AffiliateAPI.dashboard();
    setStats(extractStats(response));
    const snapshot =
      response?.dash ??
      response?.current_month ??
      response?.summary ??
      response?.stats?.current_month ??
      null;
    setDash(snapshot ?? null);
    setMonthLabel(extractMonthLabel(response));
    const percent = extractPercent(response);
    const nextMonth = response?.next_payout_month ?? response?.payout_month ?? null;

    if (!hasInitialized.current) {
      setPayoutPercentState(percent > 0 ? percent : 5);
      setPayoutMonthState(typeof nextMonth === "string" && nextMonth ? nextMonth : DEFAULT_MONTH);
      hasInitialized.current = true;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([refreshDashboard(), refreshLinks()]);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("[useAffiliateDashboard] refresh failed", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [refreshDashboard, refreshLinks]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreateLink = useCallback(async () => {
    try {
      await AffiliateAPI.createLink();
      await refreshLinks();
      show({ variant: "success", title: "Link created", description: "A new referral link is now active." });
    } catch (err) {
      const message = getErrorMessage(err);
      show({ variant: "destructive", title: "Failed to create link", description: message });
    }
  }, [refreshLinks, show]);

  const handleRotateLink = useCallback(
    async (token: string) => {
      try {
        await AffiliateAPI.rotate(token);
        await refreshLinks();
        show({ variant: "success", title: "Link rotated", description: "The referral link has been refreshed." });
      } catch (err) {
        const message = getErrorMessage(err);
        show({ variant: "destructive", title: "Failed to rotate", description: message });
      }
    },
    [refreshLinks, show]
  );

  const handleDeactivateLink = useCallback(
    async (token: string) => {
      try {
        await AffiliateAPI.deactivate(token);
        await refreshLinks();
        show({ variant: "success", title: "Link deactivated", description: "The referral link is now inactive." });
      } catch (err) {
        const message = getErrorMessage(err);
        show({ variant: "destructive", title: "Failed to deactivate", description: message });
      }
    },
    [refreshLinks, show]
  );

  const handleCopyLink = useCallback(
    async (url: string) => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          show({ variant: "success", title: "Copied", description: "Referral link copied to clipboard." });
        } else {
          throw new Error("Clipboard API unavailable");
        }
      } catch (err) {
        const message = getErrorMessage(err);
        show({ variant: "destructive", title: "Copy failed", description: message });
      }
    },
    [show]
  );

  const handleRequestPayout = useCallback(async () => {
    setRequestingPayout(true);
    try {
      await AffiliateAPI.requestPayout(payoutMonth || undefined, payoutPercent || 5);
      show({ variant: "success", title: "Payout requested", description: "Finance will review your request shortly." });
      await refreshDashboard();
    } catch (err) {
      const message = getErrorMessage(err);
      show({ variant: "destructive", title: "Request failed", description: message });
    } finally {
      setRequestingPayout(false);
    }
  }, [payoutMonth, payoutPercent, refreshDashboard, show]);

  const actions = useMemo(
    () => ({
      refresh,
      createLink: handleCreateLink,
      deactivate: handleDeactivateLink,
      rotate: handleRotateLink,
      copyLink: handleCopyLink,
      requestPayout: handleRequestPayout,
    }),
    [refresh, handleCreateLink, handleDeactivateLink, handleRotateLink, handleCopyLink, handleRequestPayout]
  );

  return {
    loading,
    error,
    stats,
    dash,
    links,
    canCreateMore,
    monthLabel,
    payoutMonth,
    payoutPercent,
    requestingPayout,
    setPayoutMonth: setPayoutMonthState,
    setPayoutPercent: setPayoutPercentState,
    actions,
  };
}
