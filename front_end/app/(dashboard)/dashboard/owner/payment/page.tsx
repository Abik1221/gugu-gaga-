"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, BillingAPI } from "@/utils/api";

export default function OwnerPaymentPage() {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [paymentCode, setPaymentCode] = useState(""
  );
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const me = await AuthAPI.me();
        if (!active) return;
        setUser(me);
        const tenantFromUser = me?.tenant_id ?? null;
        setTenantId(tenantFromUser);

        const kycApproved = me?.kyc_status === "approved";
        const subscriptionStatus = me?.subscription_status || "active";
        if (!kycApproved) {
          router.replace("/dashboard/owner/kyc");
          return;
        }
        if (subscriptionStatus === "active") {
          router.replace("/dashboard/owner");
          return;
        }

        setError(null);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Failed to load payment page");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    const trimmed = paymentCode.trim();
    if (trimmed.length < 4) {
      show({ variant: "destructive", title: "Code too short", description: "Payment codes must be at least 4 characters." });
      return;
    }
    setSubmitting(true);
    try {
      await BillingAPI.submitPaymentCode(tenantId, trimmed);
      show({ variant: "success", title: "Payment submitted", description: "We’ll notify you once the team verifies it." });
      setPaymentCode("");
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.subscription_status === "pending_verification") {
        show({ variant: "default", title: "Awaiting verification", description: "The admin team is reviewing your payment." });
      }
      if (latest?.subscription_status === "active") {
        router.replace("/dashboard/owner");
      }
    } catch (err: any) {
      show({ variant: "destructive", title: "Submission failed", description: err?.message || "Unable to submit payment code" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    if (!tenantId) return;
    setRefreshing(true);
    try {
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.kyc_status !== "approved") {
        router.replace("/dashboard/owner/kyc");
        return;
      }
      const status = latest?.subscription_status || "active";
      if (status === "active") {
        router.replace("/dashboard/owner");
      }
      show({ variant: "success", title: "Status refreshed", description: "We have the latest update." });
    } catch (err: any) {
      show({ variant: "destructive", title: "Refresh failed", description: err?.message || "Unable to refresh status" });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Skeleton className="h-64" />;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  const subscriptionStatus = user?.subscription_status || "awaiting_payment";

  const copies: Record<string, { title: string; description: string; variant: "info" | "warning" | "success" }> = {
    awaiting_payment: {
      title: "Subscription payment required",
      description: "Your pharmacy has been approved. Please enter the payment code provided by the admin desk so we can activate your tools.",
      variant: "info",
    },
    pending_verification: {
      title: "Payment awaiting verification",
      description: "Thanks for submitting your payment code. The admin team is reviewing it now. You’ll be notified as soon as it’s verified.",
      variant: "success",
    },
    payment_rejected: {
      title: "Payment could not be verified",
      description: "The last payment submission was rejected. Double-check the receipt and submit a valid payment code to continue.",
      variant: "warning",
    },
  };

  const copy = copies[subscriptionStatus] || copies.awaiting_payment;
  const bannerClasses =
    copy.variant === "warning"
      ? "border-red-200 bg-red-50 text-red-800"
      : copy.variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <div className={`rounded border p-4 space-y-4 ${bannerClasses}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide">Current status</div>
            <div className="text-lg font-semibold capitalize">{subscriptionStatus.replace(/_/g, " ")}</div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh status"}
          </Button>
        </div>

        {subscriptionStatus !== "pending_verification" && (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="payment-code-input">
                Payment code
              </label>
              <Input
                id="payment-code-input"
                value={paymentCode}
                onChange={(e) => setPaymentCode(e.target.value)}
                placeholder="Enter the receipt/payment code"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit code"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setPaymentCode("")} disabled={submitting || paymentCode.length === 0}>
                Clear
              </Button>
            </div>
          </form>
        )}

        {subscriptionStatus === "pending_verification" && (
          <div className="text-sm">
            We will email you once verification is complete. You can refresh this page to check for updates.
          </div>
        )}
      </div>
    </div>
  );
}
