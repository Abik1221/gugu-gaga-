"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, KYCAPI, UploadAPI } from "@/utils/api";

const Detail: React.FC<{ label: string; value: ReactNode; description?: ReactNode; className?: string }> = ({ label, value, description, className }) => (
  <div className={`space-y-1 rounded border border-border/60 p-3 ${className || ""}`}>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm text-white font-medium break-words">{value}</div>
    {description && <div className="text-xs text-muted-foreground">{description}</div>}
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
          pharmacy_license_document_path: data?.pharmacy_license_document_path || "",
          license_document_name: data?.license_document_name || "",
        });
      } catch (err: any) {
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("no kyc submission")) {
          setKyc(null);
        } else {
          show({ variant: "destructive", title: "Unable to load application", description: msg || "Unknown error" });
        }
      } finally {
        setKycLoading(false);
        setKycFile(null);
      }
    },
    [show],
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
      let documentPath = pendingForm.pharmacy_license_document_path || undefined;
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
        pharmacy_license_number: pendingForm.pharmacy_license_number || undefined,
        notes: pendingForm.notes || undefined,
      };
      if (documentPath) payload.pharmacy_license_document_path = documentPath;
      if (documentName) payload.license_document_name = documentName;

      await KYCAPI.update(tenantId, payload);
      show({ variant: "success", title: "Application updated", description: "We will review your changes shortly." });
      setEditing(false);
      await loadKyc(tenantId);
      const latest = await AuthAPI.me();
      setUser(latest);
      if (latest?.kyc_status === "approved") {
        if (latest?.subscription_status && latest.subscription_status !== "active") {
          router.replace("/dashboard/owner/payment");
        } else {
          router.replace("/dashboard/owner");
        }
      }
    } catch (err: any) {
      show({ variant: "destructive", title: "Update failed", description: err?.message || "Unable to update application" });
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
        if (latest?.subscription_status && latest.subscription_status !== "active") {
          router.replace("/dashboard/owner/payment");
        } else {
          router.replace("/dashboard/owner");
        }
        return;
      }
      await loadKyc(tenantId);
      show({ variant: "success", title: "Status refreshed", description: "We have the latest update." });
    } catch (err: any) {
      show({ variant: "destructive", title: "Refresh failed", description: err?.message || "Unable to refresh status" });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Skeleton className="h-64" />;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  const tenantStatus = user?.kyc_status || "pending";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Your application is under review</h1>
        <p className="text-sm text-muted-foreground">
          Thank you for submitting your pharmacy details. Our admin team is reviewing your information and will respond within 24 hours.
        </p>
        {tenantStatus === "rejected" && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            The previous submission was rejected. Please review the notes and update your details below.
          </div>
        )}
      </div>

      <div className="rounded border bg-slate-800 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Current status</div>
            <div className="text-lg font-semibold capitalize">{tenantStatus.replace("_", " ")}</div>
          </div>
          <Button variant="outline" onClick={handleRefreshStatus} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh status"}
          </Button>
        </div>

        {kycLoading ? (
          <Skeleton className="h-40" />
        ) : editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Pharmacy name</label>
                <Input className="text-white" value={pendingForm.pharmacy_name} onChange={(e) => handleFieldChange("pharmacy_name", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pharmacy address</label>
                <Input className="text-white" value={pendingForm.pharmacy_address} onChange={(e) => handleFieldChange("pharmacy_address", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Owner phone</label>
                <Input className="text-white" value={pendingForm.owner_phone} onChange={(e) => handleFieldChange("owner_phone", e.target.value)} placeholder="+2519..." />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">National / company ID</label>
                <Input className="text-white" value={pendingForm.id_number} onChange={(e) => handleFieldChange("id_number", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pharmacy license number</label>
                <Input className="text-white" value={pendingForm.pharmacy_license_number} onChange={(e) => handleFieldChange("pharmacy_license_number", e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Notes to reviewer</label>
                <textarea
                  className="mt-1 text-white w-full rounded border border-input px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
                  rows={4}
                  value={pendingForm.notes}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-muted-foreground">Upload license document (PNG/JPG/PDF)</label>
                <input className="ml-3" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setKycFile(e.target.files?.[0] || null)} />
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
                      pharmacy_license_number: kyc?.pharmacy_license_number || "",
                      notes: kyc?.notes || "",
                      pharmacy_license_document_path: kyc?.pharmacy_license_document_path || "",
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
              <Detail label="National / company ID" value={kyc?.id_number || "—"} />
              <Detail label="License number" value={kyc?.pharmacy_license_number || "—"} />
              <Detail label="Notes" value={kyc?.notes || "No notes"} />
              <Detail label="License document" value={kyc?.license_document_name || kyc?.pharmacy_license_document_path || "Not uploaded"} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => { setEditing(true); setKycFile(null); }}>
                Edit submission
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        You can continue to log in and monitor this page. Once the admin approves your application, the next step will prompt you to submit your payment code before the tools unlock.
      </div>
    </div>
  );
}
