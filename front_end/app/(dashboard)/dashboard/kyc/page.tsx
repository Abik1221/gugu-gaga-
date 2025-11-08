"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, KYCAPI, UploadAPI } from "@/utils/api";

const Detail: React.FC<{
  label: string;
  value: ReactNode;
  description?: ReactNode;
  className?: string;
}> = ({ label, value, description, className }) => (
  <div
    className={`space-y-1 rounded border border-border/60 p-3 ${
      className || ""
    }`}
  >
    <div className="text-xs uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium break-words">{value}</div>
    {description && (
      <div className="text-xs text-muted-foreground">{description}</div>
    )}
  </div>
);

export default function OwnerKycPage() {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [kyc, setKyc] = useState<any | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingForm, setPendingForm] = useState({
    pharmacy_name: "",
    pharmacy_address: "",
    owner_phone: "",
    id_number: "",
    pharmacy_license_number: "",
    notes: "",
    pharmacy_license_document_path: "",
    license_document_name: "",
  });

  const loadKyc = useCallback(
    async (tid: string) => {
      setKycLoading(true);
      try {
        const data = await KYCAPI.status(tid);
        setKyc(data);
        setPendingForm({
          pharmacy_name: data?.pharmacy_name || "",
          pharmacy_address: data?.pharmacy_address || "",
          owner_phone: data?.owner_phone || "",
          id_number: data?.id_number || "",
          pharmacy_license_number: data?.pharmacy_license_number || "",
          notes: data?.notes || "",
          pharmacy_license_document_path:
            data?.pharmacy_license_document_path || "",
          license_document_name: data?.license_document_name || "",
        });
      } catch (err: any) {
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("no kyc submission")) {
          setKyc(null);
        } else {
          show({
            variant: "destructive",
            title: "Unable to load application",
            description: msg || "Unknown error",
          });
        }
      } finally {
        setKycLoading(false);
        setKycFile(null);
      }
    },
    [show]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const me = await AuthAPI.me();
        if (!active) return;
        setUser(me);
        const tenantFromUser = me?.tenant_id ?? null;
        const kycApproved = me?.kyc_status === "approved";
        const subscriptionStatus = me?.subscription_status || "active";

        if (kycApproved) {
          if (subscriptionStatus !== "active") {
            router.replace("/dashboard/owner/payment");
          } else {
            router.replace("/dashboard/owner");
          }
          return;
        }

        setTenantId(tenantFromUser);
        if (tenantFromUser) {
          await loadKyc(tenantFromUser);
        }
        setError(null);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router, loadKyc]);

  const handleFieldChange = (key: keyof typeof pendingForm, value: string) => {
    setPendingForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    setSaving(true);
    try {
      let documentPath =
        pendingForm.pharmacy_license_document_path || undefined;
      let documentName = pendingForm.license_document_name || undefined;
      if (kycFile) {
        const upload = await UploadAPI.uploadKyc(kycFile);
        documentPath = upload.path;
        documentName = upload.filename;
      }

      const payload: any = {
        pharmacy_name: pendingForm.pharmacy_name || undefined,
        pharmacy_address: pendingForm.pharmacy_address || undefined,
        owner_phone: pendingForm.owner_phone || undefined,
        id_number: pendingForm.id_number || undefined,
        pharmacy_license_number:
          pendingForm.pharmacy_license_number || undefined,
        notes: pendingForm.notes || undefined,
      };
      if (documentPath) payload.pharmacy_license_document_path = documentPath;
      if (documentName) payload.license_document_name = documentName;

      await KYCAPI.update(tenantId, payload);
      show({
        variant: "success",
        title: "Application updated",
        description: "We will review your changes shortly.",
      });
      setEditing(false);
      await loadKyc(tenantId);
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.kyc_status === "approved") {
        if (
          latest?.subscription_status &&
          latest.subscription_status !== "active"
        ) {
          router.replace("/dashboard/owner/payment");
        } else {
          router.replace("/dashboard/owner");
        }
      }
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Update failed",
        description: err?.message || "Unable to update application",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!tenantId) return;
    setRefreshing(true);
    try {
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.kyc_status === "approved") {
        if (
          latest?.subscription_status &&
          latest.subscription_status !== "active"
        ) {
          router.replace("/dashboard/owner/payment");
        } else {
          router.replace("/dashboard/owner");
        }
        return;
      }
      await loadKyc(tenantId);
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

  const tenantStatus = user?.kyc_status || "pending";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Application Under Review
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Thank you for submitting your pharmacy details. Our team will review
          your information within 24 hours.
        </p>
        {tenantStatus === "rejected" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl mx-auto">
            ⚠️ Previous submission was rejected. Please review and update your
            details below.
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                tenantStatus === "approved"
                  ? "bg-green-500"
                  : tenantStatus === "rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <p className="text-xl font-semibold capitalize text-gray-900">
                {tenantStatus.replace("_", " ")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefreshStatus}
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

        {kycLoading ? (
          <Skeleton className="h-40" />
        ) : editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Pharmacy name
                </label>
                <Input
                  className="text-black"
                  value={pendingForm.pharmacy_name}
                  onChange={(e) =>
                    handleFieldChange("pharmacy_name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Pharmacy address
                </label>
                <Input
                  value={pendingForm.pharmacy_address}
                  onChange={(e) =>
                    handleFieldChange("pharmacy_address", e.target.value)
                  }
                  className="text-black"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Owner phone
                </label>
                <Input
                  value={pendingForm.owner_phone}
                  onChange={(e) =>
                    handleFieldChange("owner_phone", e.target.value)
                  }
                  placeholder="+2519..."
                  className="text-black"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  National / company ID
                </label>
                <Input
                  value={pendingForm.id_number}
                  onChange={(e) =>
                    handleFieldChange("id_number", e.target.value)
                  }
                  required
                  className="text-black"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Pharmacy license number
                </label>
                <Input
                  value={pendingForm.pharmacy_license_number}
                  onChange={(e) =>
                    handleFieldChange("pharmacy_license_number", e.target.value)
                  }
                  required
                  className="text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">
                  Notes to reviewer
                </label>
                <textarea
                  className="mt-1 w-full rounded border border-input px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-ring text-black"
                  rows={4}
                  value={pendingForm.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-muted-foreground">
                  Upload license document (PNG/JPG/PDF)
                </label>
                <input
                  className="ml-3"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                />
                <div className="text-xs text-muted-foreground">
                  {kycFile
                    ? `Ready to upload: ${kycFile.name}`
                    : pendingForm.license_document_name
                    ? `Current file: ${pendingForm.license_document_name}`
                    : "No file uploaded yet"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Submit updates"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  if (kyc) {
                    setPendingForm({
                      pharmacy_name: kyc?.pharmacy_name || "",
                      pharmacy_address: kyc?.pharmacy_address || "",
                      owner_phone: kyc?.owner_phone || "",
                      id_number: kyc?.id_number || "",
                      pharmacy_license_number:
                        kyc?.pharmacy_license_number || "",
                      notes: kyc?.notes || "",
                      pharmacy_license_document_path:
                        kyc?.pharmacy_license_document_path || "",
                      license_document_name: kyc?.license_document_name || "",
                    });
                  }
                  setKycFile(null);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Pharmacy name" value={kyc?.pharmacy_name || "—"} />
              <Detail label="Address" value={kyc?.pharmacy_address || "—"} />
              <Detail label="Owner phone" value={kyc?.owner_phone || "—"} />
              <Detail
                label="National / company ID"
                value={kyc?.id_number || "—"}
              />
              <Detail
                label="License number"
                value={kyc?.pharmacy_license_number || "—"}
              />
              <Detail label="Notes" value={kyc?.notes || "No notes"} />
              <Detail
                label="License document"
                value={
                  kyc?.license_document_name ||
                  kyc?.pharmacy_license_document_path ||
                  "Not uploaded"
                }
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setEditing(true);
                  setKycFile(null);
                }}
              >
                Edit submission
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        You can continue to log in and monitor this page. Once the admin
        approves your application, the next step will prompt you to submit your
        payment code before the tools unlock.
      </div>
    </div>
  );
}
