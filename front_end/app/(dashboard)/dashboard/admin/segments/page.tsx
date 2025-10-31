"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";

type PharmacySummaryItem = {
  tenant_id: string;
  name?: string | null;
  status: string;
  status_label: string;
  branch_count: number;
  user_count: number;
  trial_ends_at?: string | null;
  last_payment_verified_at?: string | null;
  pending_payment_submitted_at?: string | null;
};

type PharmacySummaryResponse = {
  totals: {
    total: number;
    paid: number;
    free_trial: number;
    payment_pending: number;
    blocked: number;
    onboarding: number;
    unpaid: number;
  };
  items: PharmacySummaryItem[];
};

const SEGMENTS: {
  key: PharmacySummaryItem["status"];
  title: string;
  description: string;
  tone?: "default" | "warning" | "danger" | "info";
}[] = [
  {
    key: "paid",
    title: "Active (Paid)",
    description: "Fully onboarded pharmacies with verified payments.",
  },
  {
    key: "free_trial",
    title: "Free Trial",
    description: "Tenants still within their free-trial window.",
    tone: "info",
  },
  {
    key: "payment_pending",
    title: "Payment Under Review",
    description: "Submitted payment codes awaiting admin verification.",
    tone: "warning",
  },
  {
    key: "unpaid",
    title: "Awaiting Payment",
    description: "Approved KYC but no payment received yet.",
    tone: "warning",
  },
  {
    key: "blocked",
    title: "Blocked",
    description: "Access suspended due to missing or rejected payments.",
    tone: "danger",
  },
  {
    key: "onboarding",
    title: "Onboarding",
    description: "KYC still pending approval.",
    tone: "info",
  },
];

function summarizeDate(label: string, iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return `${label}: ${iso}`;
  return `${label}: ${date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
}

export default function AdminSegmentsPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PharmacySummaryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<PharmacySummaryItem["status"]>("paid");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const response = (await AdminAPI.pharmacySummary()) as PharmacySummaryResponse;
        if (!active) return;
        setData(response);
        setError(null);
      } catch (err: any) {
        if (!active) return;
        const message = err?.message || "Failed to load pharmacy summary";
        setError(message);
        show({ variant: "destructive", title: "Error", description: message });
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [show]);

  const grouped = useMemo(() => {
    const map = new Map<string, PharmacySummaryItem[]>();
    SEGMENTS.forEach((segment) => map.set(segment.key, []));
    data?.items.forEach((item) => {
      const segmentList = map.get(item.status) || [];
      segmentList.push(item);
      map.set(item.status, segmentList);
    });
    return map;
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div className="text-sm text-muted-foreground">No data available.</div>;
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Pharmacy Segments</h1>
        <p className="text-sm text-muted-foreground">
          Track every tenant across onboarding, payment, and retention states. Use these segments to drive outreach and support.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard label="Total Pharmacies" value={data.totals.total} />
        <SummaryCard label="Active (Paid)" value={data.totals.paid} tone="success" />
        <SummaryCard label="Free Trial" value={data.totals.free_trial} tone="info" />
        <SummaryCard label="Payment Pending" value={data.totals.payment_pending} tone="warning" />
        <SummaryCard label="Awaiting Payment" value={data.totals.unpaid} tone="muted" />
        <SummaryCard label="Blocked" value={data.totals.blocked} tone="danger" />
        <SummaryCard label="Onboarding" value={data.totals.onboarding} tone="info" />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as PharmacySummaryItem["status"])}
        className="space-y-6"
      >
        <TabsList className="flex-wrap justify-start">
          {SEGMENTS.map((segment) => {
            const count = grouped.get(segment.key)?.length || 0;
            return (
              <TabsTrigger key={segment.key} value={segment.key} className="flex items-center gap-2">
                {segment.title}
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SEGMENTS.map((segment) => {
          const list = grouped.get(segment.key) || [];
          return (
            <TabsContent key={segment.key} value={segment.key} className="space-y-4">
              <SegmentHeader segment={segment} count={list.length} />
              {list.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    No pharmacies found in this segment.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {list.map((item) => (
                    <SegmentCard key={item.tenant_id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning" | "danger" | "info" | "muted";
}) {
  const toneClasses: Record<typeof tone, string> = {
    default: "border-white/10 bg-white/5",
    success: "border-emerald-400/40 bg-emerald-500/15",
    warning: "border-amber-400/40 bg-amber-500/15",
    danger: "border-red-400/40 bg-red-500/15",
    info: "border-sky-400/40 bg-sky-500/15",
    muted: "border-white/10 bg-white/5",
  };
  return (
    <Card className={toneClasses[tone]}>
      <CardHeader className="py-4">
        <CardTitle className="text-sm text-muted-foreground uppercase tracking-[0.2em]">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-white">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function SegmentHeader({
  segment,
  count,
}: {
  segment: (typeof SEGMENTS)[number];
  count: number;
}) {
  const badgeTone =
    segment.tone === "danger"
      ? "bg-red-500/20 text-red-200"
      : segment.tone === "warning"
      ? "bg-amber-500/20 text-amber-100"
      : segment.tone === "info"
      ? "bg-sky-500/20 text-sky-100"
      : "bg-white/10 text-white";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {segment.title}
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeTone}`}>
            {count}
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{segment.description}</p>
      </div>
      <Button variant="outline" size="sm" className="self-start">
        Export Segment
      </Button>
    </div>
  );
}

function SegmentCard({ item }: { item: PharmacySummaryItem }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white">{item.name || item.tenant_id}</CardTitle>
        <p className="text-xs text-muted-foreground font-mono">{item.tenant_id}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="grid gap-1">
          <span>Branches: {item.branch_count}</span>
          <span>Users: {item.user_count}</span>
        </div>
        {summarizeDate("Trial ends", item.trial_ends_at) && <div>{summarizeDate("Trial ends", item.trial_ends_at)}</div>}
        {summarizeDate("Last payment", item.last_payment_verified_at) && (
          <div className="text-emerald-200 text-xs">{summarizeDate("Last payment", item.last_payment_verified_at)}</div>
        )}
        {summarizeDate("Payment submitted", item.pending_payment_submitted_at) && (
          <div className="text-amber-200 text-xs">{summarizeDate("Payment submitted", item.pending_payment_submitted_at)}</div>
        )}
        <div>
          <Badge variant="outline" className="uppercase tracking-[0.2em] text-xs">
            {item.status_label}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1">
            Open details
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Message owner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
