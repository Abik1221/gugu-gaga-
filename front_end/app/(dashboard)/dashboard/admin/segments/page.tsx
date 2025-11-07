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
  const [activeTab, setActiveTab] =
    useState<PharmacySummaryItem["status"]>("paid");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const response =
          (await AdminAPI.pharmacySummary()) as PharmacySummaryResponse;
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
    return (
      <div className="text-sm text-muted-foreground">No data available.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Pharmacy Segments</h1>
          <p className="mt-2 text-slate-600">
            Track every tenant across onboarding, payment, and retention states.
            Use these segments to drive outreach and support.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Pharmacies" value={data.totals.total} />
          <SummaryCard
            label="Active (Paid)"
            value={data.totals.paid}
            tone="success"
          />
          <SummaryCard
            label="Free Trial"
            value={data.totals.free_trial}
            tone="info"
          />
          <SummaryCard
            label="Payment Pending"
            value={data.totals.payment_pending}
            tone="warning"
          />
          <SummaryCard
            label="Awaiting Payment"
            value={data.totals.unpaid}
            tone="muted"
          />
          <SummaryCard
            label="Blocked"
            value={data.totals.blocked}
            tone="danger"
          />
          <SummaryCard
            label="Onboarding"
            value={data.totals.onboarding}
            tone="info"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as PharmacySummaryItem["status"])
            }
            className="p-6"
          >
            <TabsList className="mb-8 flex flex-wrap gap-3 bg-transparent p-0 h-auto">
              {SEGMENTS.map((segment) => {
                const count = grouped.get(segment.key)?.length || 0;
                const isActive = activeTab === segment.key;
                return (
                  <TabsTrigger
                    key={segment.key}
                    value={segment.key}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all border-0 ${
                      isActive 
                        ? "bg-emerald-600 text-white data-[state=active]:bg-emerald-600 data-[state=active]:text-white" 
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {segment.title}
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      isActive 
                        ? "bg-emerald-500 text-white" 
                        : "bg-white text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {SEGMENTS.map((segment) => {
              const list = grouped.get(segment.key) || [];
              return (
                <TabsContent
                  key={segment.key}
                  value={segment.key}
                  className="space-y-6"
                >
                  <SegmentHeader segment={segment} count={list.length} />
                  {list.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
                      <div className="text-slate-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-1">No pharmacies found</h3>
                      <p className="text-slate-500">No pharmacies found in this segment.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
      </div>
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
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    muted: "border-slate-200 bg-slate-50",
  };
  
  const textClasses: Record<typeof tone, string> = {
    default: "text-slate-900",
    success: "text-emerald-900",
    warning: "text-amber-900",
    danger: "text-red-900",
    info: "text-blue-900",
    muted: "text-slate-700",
  };
  
  return (
    <Card className={`${toneClasses[tone]} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textClasses[tone]}`}>
          {value.toLocaleString()}
        </div>
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
      ? "bg-red-100 text-red-700 border-red-200"
      : segment.tone === "warning"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : segment.tone === "info"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
          {segment.title}
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium ${badgeTone}`}
          >
            {count}
          </span>
        </h2>
        <p className="text-slate-600 mt-1">
          {segment.description}
        </p>
      </div>
      <Button variant="outline" size="sm" className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
        Export Segment
      </Button>
    </div>
  );
}

function SegmentCard({ item }: { item: PharmacySummaryItem }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          {item.name || item.tenant_id}
        </CardTitle>
        <p className="text-sm text-slate-500 font-mono bg-slate-100 rounded px-2 py-1 inline-block">
          {item.tenant_id}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{item.branch_count}</div>
            <div className="text-sm text-slate-600">Branches</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{item.user_count}</div>
            <div className="text-sm text-slate-600">Users</div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {summarizeDate("Trial ends", item.trial_ends_at) && (
            <div className="text-slate-600">{summarizeDate("Trial ends", item.trial_ends_at)}</div>
          )}
          {summarizeDate("Last payment", item.last_payment_verified_at) && (
            <div className="text-emerald-700 bg-emerald-50 rounded px-2 py-1">
              {summarizeDate("Last payment", item.last_payment_verified_at)}
            </div>
          )}
          {summarizeDate(
            "Payment submitted",
            item.pending_payment_submitted_at
          ) && (
            <div className="text-amber-700 bg-amber-50 rounded px-2 py-1">
              {summarizeDate(
                "Payment submitted",
                item.pending_payment_submitted_at
              )}
            </div>
          )}
        </div>
        
        <div>
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-300 font-medium"
          >
            {item.status_label}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
            Open Details
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50">
            Message Owner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
