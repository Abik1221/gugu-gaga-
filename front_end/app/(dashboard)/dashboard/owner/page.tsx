"use client";
import React, { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthAPI, PharmaciesAPI, ChatAPI, KYCAPI, UploadAPI, BillingAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";

const Detail: React.FC<{ label: string; value: ReactNode; description?: ReactNode; className?: string }> = ({ label, value, description, className }) => (
  <div className={`space-y-1 rounded border border-border/60 bg-white/40 p-3 ${className || ""}`}>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm font-medium break-words">{value}</div>
    {description && <div className="text-xs text-muted-foreground">{description}</div>}
  </div>
);

export default function OwnerDashboardPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<Array<{ day: string; tokens: number }>>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [kyc, setKyc] = useState<any | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [kycFile, setKycFile] = useState<File | null>(null);
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
  const [paymentCode, setPaymentCode] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

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
        const requiresPayment = kycApproved && subscriptionStatus !== "active";

        if (!kycApproved) {
          setPharmacies([]);
          setUsage([]);
          setTenantId(tenantFromUser);
          if (tenantFromUser) {
            await loadKyc(tenantFromUser);
          } else {
            setKyc(null);
          }
          return;
        }

        if (requiresPayment) {
          setPharmacies([]);
          setUsage([]);
          setTenantId(tenantFromUser);
          return;
        }

        const ph = await PharmaciesAPI.list(1, 20);
        if (!active) return;
        const items = ph.items || [];
        setPharmacies(items);
        const tid = tenantFromUser || (items[0]?.tenant_id ?? null);
        if (!active) return;
        setTenantId(tid);
        if (tid) {
          try {
            const u = await ChatAPI.usage(tid, 14);
            if (!active) return;
            setUsage(Array.isArray(u) ? u : []);
          } catch {
            setUsage([]);
          }
        }
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load dashboard");
        show({ variant: "destructive", title: "Error", description: e.message || "Failed" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [show, loadKyc]);

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
      const latestSubscriptionStatus = latest?.subscription_status || "active";
      const requiresPaymentLatest = latest?.kyc_status === "approved" && latestSubscriptionStatus !== "active";
      if (latest?.kyc_status !== "approved") {
        await loadKyc(tenantId);
        setPharmacies([]);
        setUsage([]);
      } else if (requiresPaymentLatest) {
        setPharmacies([]);
        setUsage([]);
      } else {
        const u = await ChatAPI.usage(tenantId, 14).catch(() => []);
        setUsage(Array.isArray(u) ? u : []);
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

  const tenantStatus = user?.kyc_status || "pending";
  const subscriptionStatus = user?.subscription_status || "active";
  const requiresPayment = user?.kyc_status === "approved" && subscriptionStatus !== "active";

  const paymentCopies: Record<string, { title: string; description: string; variant: "info" | "warning" | "success" }> = {
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

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    const trimmed = paymentCode.trim();
    if (trimmed.length < 4) {
      show({ variant: "destructive", title: "Code too short", description: "Payment codes must be at least 4 characters." });
      return;
    }
    setSubmittingPayment(true);
    try {
      await BillingAPI.submitPaymentCode(tenantId, trimmed);
      show({ variant: "success", title: "Payment submitted", description: "We’ll notify you once the team verifies it." });
      setPaymentCode("");
      const latest = await AuthAPI.me();
      setUser(latest);
    } catch (err: any) {
      show({ variant: "destructive", title: "Submission failed", description: err?.message || "Unable to submit payment code" });
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (user?.kyc_status !== "approved") {
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

        <div className="rounded border bg-white p-4 shadow-sm space-y-4">
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
                  <Input value={pendingForm.pharmacy_name} onChange={(e) => handleFieldChange("pharmacy_name", e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Pharmacy address</label>
                  <Input value={pendingForm.pharmacy_address} onChange={(e) => handleFieldChange("pharmacy_address", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Owner phone</label>
                  <Input value={pendingForm.owner_phone} onChange={(e) => handleFieldChange("owner_phone", e.target.value)} placeholder="+2519..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">National / company ID</label>
                  <Input value={pendingForm.id_number} onChange={(e) => handleFieldChange("id_number", e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Pharmacy license number</label>
                  <Input value={pendingForm.pharmacy_license_number} onChange={(e) => handleFieldChange("pharmacy_license_number", e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Notes to reviewer</label>
                  <textarea
                    className="mt-1 w-full rounded border border-input px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
                    rows={4}
                    value={pendingForm.notes}
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-muted-foreground">Upload license document (PNG/JPG/PDF)</label>
                  <input
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
                <Detail
                  label="License document"
                  value={kyc?.license_document_name || kyc?.pharmacy_license_document_path || "Not uploaded"}
                />
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
          You can continue to log in and monitor this page. Once the admin approves your application, your full dashboard and point of sale tools will unlock automatically.
        </div>
      </div>
    );
  }

  if (requiresPayment) {
    const paymentMeta = paymentCopies[subscriptionStatus] || paymentCopies.awaiting_payment;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{paymentMeta.title}</h1>
          <p className="text-sm text-muted-foreground">{paymentMeta.description}</p>
        </div>

        <div
          className={`rounded border p-4 space-y-4 ${paymentMeta.variant === "warning" ? "border-red-200 bg-red-50 text-red-800" : paymentMeta.variant === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide">Current status</div>
              <div className="text-lg font-semibold capitalize">{subscriptionStatus.replace(/_/g, " ")}</div>
            </div>
            <Button variant="outline" onClick={handleRefreshStatus} disabled={refreshing}>
              {refreshing ? "Refreshing..." : "Refresh status"}
            </Button>
          </div>

          {subscriptionStatus !== "pending_verification" && (
            <form className="space-y-3" onSubmit={handleSubmitPayment}>
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
                <Button type="submit" disabled={submittingPayment}>
                  {submittingPayment ? "Submitting..." : "Submit code"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setPaymentCode("")} disabled={submittingPayment || paymentCode.length === 0}>
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

  if (requiresPayment) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Owner Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/owner/staff/new"><Button variant="outline">Create Cashier</Button></Link>
          <Link href="/dashboard/owner/chat"><Button variant="outline">Open Chat</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Role</div>
          <div className="text-lg font-medium">{user?.role}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Tenant</div>
          <div className="text-lg font-medium">{user?.tenant_id || "-"}</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-xs text-gray-500">Pharmacies</div>
          <div className="text-lg font-medium">{pharmacies.length}</div>
        </div>
      </div>

      {usage.length > 0 && (
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">AI Usage (last 14 days)</div>
            <div className="text-xs text-gray-500">tokens</div>
          </div>
          <div className="flex items-end gap-1 h-24">
            {usage.map((d)=>{
              const max = Math.max(...usage.map(x=>x.tokens || 0)) || 1;
              const h = Math.max(2, Math.round((d.tokens / max) * 96));
              return (
                <div key={d.day} className="flex flex-col items-center" title={`${d.day}: ${d.tokens}`}>
                  <div className="bg-blue-500 w-4" style={{ height: `${h}px` }} />
                  <div className="text-[10px] text-gray-500 mt-1">{d.day.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Tenant</th>
              <th className="px-3 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pharmacies.map((p)=> (
              <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>location.href=`/dashboard/owner/pharmacies/${p.id}/settings`}>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.tenant_id}</td>
                <td className="px-3 py-2">{p.address || "-"}</td>
              </tr>
            ))}
            {pharmacies.length === 0 && (
              <tr><td className="px-3 py-4 text-gray-500" colSpan={3}>No pharmacies yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
