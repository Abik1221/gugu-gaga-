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
  const [paymentCode, setPaymentCode] = useState("");
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
          // router.replace("/dashboard/kyc");
          // return;
        }
        if (subscriptionStatus === "active") {
          // router.replace("/dashboard/owner");
          // return;
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
      show({
        variant: "destructive",
        title: "Code too short",
        description: "Payment codes must be at least 4 characters.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await BillingAPI.submitPaymentCode(tenantId, trimmed);
      show({
        variant: "success",
        title: "Payment submitted",
        description: "We’ll notify you once the team verifies it.",
      });
      setPaymentCode("");
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.subscription_status === "pending_verification") {
        show({
          variant: "default",
          title: "Awaiting verification",
          description: "The admin team is reviewing your payment.",
        });
      }
      if (latest?.subscription_status === "active") {
        router.replace("/dashboard/owner");
      }
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Submission failed",
        description: err?.message || "Unable to submit payment code",
      });
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
      show({
        variant: "success",
        title: "Status refreshed",
        description: "We have the latest update.",
      });
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Refresh failed",
        description: err?.message || "Unable to refresh status",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Skeleton className="h-64" />;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  const subscriptionStatus = user?.subscription_status || "awaiting_payment";

  const copies: Record<
    string,
    {
      title: string;
      description: string;
      variant: "info" | "warning" | "success";
    }
  > = {
    awaiting_payment: {
      title: "Subscription payment required",
      description:
        "Your pharmacy has been approved. Please enter the payment code provided by the admin desk so we can activate your tools.",
      variant: "info",
    },
    pending_verification: {
      title: "Payment awaiting verification",
      description:
        "Thanks for submitting your payment code. The admin team is reviewing it now. You’ll be notified as soon as it’s verified.",
      variant: "success",
    },
    payment_rejected: {
      title: "Payment could not be verified",
      description:
        "The last payment submission was rejected. Double-check the receipt and submit a valid payment code to continue.",
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{copy.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{copy.description}</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                subscriptionStatus === "active"
                  ? "bg-green-500"
                  : subscriptionStatus === "pending_verification"
                  ? "bg-blue-500"
                  : subscriptionStatus === "payment_rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <p className="text-xl font-semibold capitalize text-gray-900">
                {subscriptionStatus.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>

        {subscriptionStatus !== "pending_verification" && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="payment-code-input"
              >
                Payment Code
              </label>
              <Input
                id="payment-code-input"
                value={paymentCode}
                onChange={(e) => setPaymentCode(e.target.value)}
                placeholder="Enter your payment receipt code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex-1"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Payment Code"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentCode("")}
                disabled={submitting || paymentCode.length === 0}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
              >
                Clear
              </Button>
            </div>
          </form>
        )}

        {subscriptionStatus === "pending_verification" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium">
                Payment verification in progress. We'll email you once complete.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
