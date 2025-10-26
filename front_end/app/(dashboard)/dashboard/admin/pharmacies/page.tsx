"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminPharmacy = {
  id: number;
  tenant_id: string;
  name: string;
  address?: string | null;
  owner_email?: string | null;
  owner_phone?: string | null;
  owner_approved?: boolean | null;
  kyc_id?: number | null;
  kyc_status?: string | null;
  subscription?: { blocked?: boolean | null; next_due_date?: string | null; status?: string | null } | null;
  created_at?: string | null;
  pending_payment_code?: string | null;
  pending_payment_submitted_at?: string | null;
  latest_payment_code?: string | null;
  latest_payment_status?: string | null;
  latest_payment_submitted_at?: string | null;
  latest_payment_verified_at?: string | null;
  status_category: "pending_kyc" | "awaiting_payment" | "pending_verification" | "active" | "blocked" | string;
  status_label: string;
  status_priority: number;
  pending_payment?: {
    code?: string | null;
    status?: string | null;
    submitted_at?: string | null;
    submitted_by_user_id?: number | null;
  } | null;
  latest_payment?: {
    code?: string | null;
    status?: string | null;
    submitted_at?: string | null;
    verified_at?: string | null;
  } | null;
  kyc?: {
    application_id?: number | null;
    status?: string | null;
    applicant_user_id?: number | null;
    id_number?: string | null;
    pharmacy_license_number?: string | null;
    license_document_name?: string | null;
    license_document_mime?: string | null;
    license_document_available: boolean;
    notes?: string | null;
    submitted_at?: string | null;
    pharmacy_name?: string | null;
    pharmacy_address?: string | null;
    owner_email?: string | null;
    owner_phone?: string | null;
  } | null;
  owner_password_hash?: string | null;
};

type PendingActionState = {
  type: "approve" | "reject" | "verify" | "rejectPayment";
  tenantId: string;
  name: string;
  kycId?: number | null;
  pendingPayment?: AdminPharmacy["pending_payment"];
};

type ConfirmOptions = {
  issueTempPassword: boolean;
  tempPassword: string;
};

const STATUS_SECTIONS: { key: AdminPharmacy["status_category"]; title: string }[] = [
  { key: "pending_kyc", title: "Pending KYC" },
  { key: "awaiting_payment", title: "Awaiting Payment" },
  { key: "pending_verification", title: "Awaiting Verification" },
  { key: "active", title: "Active Pharmacies" },
  { key: "blocked", title: "Blocked / Rejected" },
];

const STATUS_TONE: Record<string, "primary" | "muted" | "outline" | "danger"> = {
  pending_kyc: "primary",
  awaiting_payment: "outline",
  pending_verification: "primary",
  active: "muted",
  blocked: "danger",
};

function generatePassword(length = 12): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

function sortPharmacies(list: AdminPharmacy[]): AdminPharmacy[] {
  return [...list].sort((a, b) => {
    if (a.status_priority !== b.status_priority) {
      return a.status_priority - b.status_priority;
    }
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

function formatDateTime(value?: string | null, options: Intl.DateTimeFormatOptions = {}) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", ...options });
  } catch (e) {
    return value;
  }
}

export default function AdminPharmaciesPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AdminPharmacy[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingActionState | null>(null);
  const [processing, setProcessing] = useState(false);
  const [recentCredentials, setRecentCredentials] = useState<{ tenantId: string; name: string; tempPassword: string } | null>(null);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>({ issueTempPassword: false, tempPassword: "" });

  const handleDialogCancel = () => {
    setPendingAction(null);
    setConfirmOptions({ issueTempPassword: false, tempPassword: "" });
  };

  function openAction(action: PendingActionState) {
    setPendingAction(action);
    setConfirmOptions({ issueTempPassword: false, tempPassword: "" });
  }

  async function handleCopyPassword(password: string) {
    try {
      await navigator.clipboard.writeText(password);
      show({ variant: "success", title: "Copied", description: "Temporary password copied to clipboard" });
    } catch (err: any) {
      show({ variant: "destructive", title: "Copy failed", description: err?.message || "Unable to copy password" });
    }
  }

  async function refresh(page = 1) {
    setLoading(true);
    try {
      const data = (await AdminAPI.pharmacies(page, 20, q)) as { items?: AdminPharmacy[]; total?: number };
      const sorted = sortPharmacies(data.items || []);
      setItems(sorted);
      setTotal(data.total || sorted.length);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load pharmacies");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminPharmacy[]>();
    STATUS_SECTIONS.forEach((section) => map.set(section.key, []));
    items.forEach((item) => {
      const bucket = map.get(item.status_category) ?? map.get("blocked") ?? [];
      bucket.push(item);
      map.set(item.status_category, bucket);
    });
    return map;
  }, [items]);

  function updateTenant(tenantId: string, updater: (prev: AdminPharmacy) => AdminPharmacy) {
    setItems((prev) => {
      const updated = prev.map((item) => (item.tenant_id === tenantId ? updater(item) : item));
      return sortPharmacies(updated);
    });
  }

  return (
    <>
      {recentCredentials && (
        <div className="mb-4 rounded border border-emerald-500/60 bg-emerald-50 p-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-semibold text-emerald-800">Temporary credentials issued</div>
            <div className="text-xs text-emerald-700">
              {recentCredentials.name} (tenant {recentCredentials.tenantId}) — share the password securely with the owner.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-900 text-sm">{recentCredentials.tempPassword}</span>
            <Button size="sm" variant="outline" onClick={() => handleCopyPassword(recentCredentials.tempPassword)}>Copy</Button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin · Pharmacies</h1>
          <div className="flex gap-2">
            <Input placeholder="Search by name" value={q} onChange={(e)=>setQ(e.target.value)} />
            <Button onClick={()=>refresh(1)}>Search</Button>
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-64" />
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="border rounded p-6 text-center text-gray-500">No pharmacies found.</div>
        ) : (
          <div className="space-y-6">
            {STATUS_SECTIONS.map((section) => {
              const sectionItems = grouped.get(section.key) || [];
              if (sectionItems.length === 0) return null;
              return (
                <div key={section.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    <span className="text-xs text-muted-foreground">{sectionItems.length} {sectionItems.length === 1 ? "pharmacy" : "pharmacies"}</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sectionItems.map((ph) => {
                      const isSelected = selectedTenant === ph.tenant_id;
                      const statusTone = STATUS_TONE[ph.status_category] || "muted";
                      const canApprove = ph.status_category === "pending_kyc" && !!ph.kyc_id;
                      const canReject = ph.status_category === "pending_kyc" && !!ph.kyc_id;
                      const pendingCode = ph.pending_payment?.code || ph.pending_payment_code;
                      const canVerify = ph.status_category === "pending_verification" && !!pendingCode;
                      const canRejectPayment = ph.status_category === "pending_verification" && !!pendingCode;
                      const kyc = ph.kyc;

                      return (
                        <Card
                          key={ph.id}
                          className={cn("transition-shadow", isSelected && "border-blue-500 shadow-lg")}
                          onClick={() => setSelectedTenant(ph.tenant_id)}
                        >
                          <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{ph.name}</CardTitle>
                              <div className="text-xs text-muted-foreground font-mono">{ph.tenant_id}</div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              <StatusPill tone={statusTone}>{ph.status_label}</StatusPill>
                              {ph.owner_approved && <StatusPill tone="outline">Owner approved</StatusPill>}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid gap-2">
                              <InfoRow label="Owner" value={ph.owner_email || "-"} description={ph.owner_phone} />
                              <InfoRow label="Created" value={formatDateTime(ph.created_at)} />
                              <InfoRow label="Address" value={ph.address || "-"} />
                              <InfoRow
                                label="Subscription"
                                value={ph.subscription?.status ? ph.subscription.status.replace("_", " ").toUpperCase() : "-"}
                                description={ph.subscription?.next_due_date ? `Next due: ${formatDateTime(ph.subscription.next_due_date, { dateStyle: "medium" })}` : undefined}
                              />
                              {pendingCode && (
                                <InfoRow
                                  label="Pending payment"
                                  value={pendingCode}
                                  description={ph.pending_payment?.submitted_at ? `Submitted ${formatDateTime(ph.pending_payment?.submitted_at)}` : undefined}
                                />
                              )}
                              <InfoRow
                                label="Latest payment"
                                value={ph.latest_payment?.code || ph.latest_payment_code || "—"}
                                description={ph.latest_payment?.status ? `${ph.latest_payment?.status?.toUpperCase?.()}${ph.latest_payment?.submitted_at ? ` · ${formatDateTime(ph.latest_payment?.submitted_at)}` : ""}` : undefined}
                              />
                              {kyc && (
                                <div className="rounded border p-3 space-y-2 bg-muted/50">
                                  <div className="text-sm font-semibold">KYC Details</div>
                                  <div className="grid gap-2 md:grid-cols-2">
                                    <InfoRow label="KYC Status" value={kyc.status?.toUpperCase() || "-"} />
                                    <InfoRow label="Submitted" value={formatDateTime(kyc.submitted_at)} />
                                    <InfoRow label="ID Number" value={kyc.id_number || "-"} />
                                    <InfoRow label="License Number" value={kyc.pharmacy_license_number || "-"} />
                                    {kyc.pharmacy_name && <InfoRow label="Registered Pharmacy Name" value={kyc.pharmacy_name} />}
                                    {kyc.pharmacy_address && <InfoRow label="Registered Address" value={kyc.pharmacy_address} />}
                                    {kyc.owner_email && <InfoRow label="Owner Email (submitted)" value={kyc.owner_email} />}
                                    {kyc.owner_phone && <InfoRow label="Owner Phone (submitted)" value={kyc.owner_phone} />}
                                  </div>
                                  {kyc.notes && <div className="text-xs text-muted-foreground">Notes: {kyc.notes}</div>}
                                  {kyc.license_document_available && kyc.application_id && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const appId = kyc.application_id;
                                        if (typeof appId !== "number") return;
                                        AdminAPI.downloadPharmacyLicense(appId).catch((err) =>
                                          show({ variant: "destructive", title: "Download failed", description: err.message || "Unable to download license" }),
                                        );
                                      }}
                                    >
                                      Download License
                                    </Button>
                                  )}
                                </div>
                              )}
                              {ph.owner_password_hash && (
                                <InfoRow label="Owner Password Hash" value={ph.owner_password_hash} masked />
                              )}
                            </div>

                            <div className="h-px bg-border" />

                            <div className="flex flex-wrap gap-2">
                              <Button
                                disabled={!canApprove}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAction({ type: "approve", tenantId: ph.tenant_id, kycId: ph.kyc_id, name: ph.name });
                                }}
                              >Approve & Notify</Button>
                              <Button
                                variant="outline"
                                disabled={!canReject}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAction({ type: "reject", tenantId: ph.tenant_id, kycId: ph.kyc_id, name: ph.name });
                                }}
                              >Reject</Button>
                              <Button
                                variant="secondary"
                                disabled={!canVerify}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAction({ type: "verify", tenantId: ph.tenant_id, name: ph.name, pendingPayment: ph.pending_payment });
                                }}
                              >Verify Payment</Button>
                              <Button
                                variant="outline"
                                disabled={!canRejectPayment}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAction({ type: "rejectPayment", tenantId: ph.tenant_id, name: ph.name, pendingPayment: ph.pending_payment });
                                }}
                              >Reject Payment</Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {pendingAction && (
        <ConfirmDialog
          action={pendingAction}
          loading={processing}
          onCancel={() => {
            if (processing) return;
            handleDialogCancel();
          }}
          onConfirm={async () => {
            if (processing) return;
            setProcessing(true);
            try {
              switch (pendingAction.type) {
                case "approve": {
                  if (pendingAction.kycId == null) {
                    show({ variant: "destructive", title: "Missing application", description: "No KYC record found for this tenant." });
                    setProcessing(false);
                    return;
                  }
                  const trimmedPassword = confirmOptions.tempPassword.trim();
                  if (confirmOptions.issueTempPassword && trimmedPassword && trimmedPassword.length < 6) {
                    show({ variant: "destructive", title: "Password too short", description: "Temporary passwords must be at least 6 characters." });
                    setProcessing(false);
                    return;
                  }
                  const res = await AdminAPI.approvePharmacy(pendingAction.tenantId, pendingAction.kycId, {
                    issue_temp_password: confirmOptions.issueTempPassword,
                    temp_password: confirmOptions.issueTempPassword ? (trimmedPassword || undefined) : undefined,
                  });
                  const generated = (res as any)?.temporary_password as string | undefined;
                  if (generated) {
                    setRecentCredentials({ tenantId: pendingAction.tenantId, name: pendingAction.name, tempPassword: generated });
                  } else if (confirmOptions.issueTempPassword && trimmedPassword) {
                    setRecentCredentials({ tenantId: pendingAction.tenantId, name: pendingAction.name, tempPassword: trimmedPassword });
                  } else {
                    setRecentCredentials(null);
                  }
                  show({ variant: "success", title: "Pharmacy approved", description: `${pendingAction.name} will be notified to pay` });
                  refresh();
                  break;
                }
                case "reject":
                  await AdminAPI.rejectPharmacy(pendingAction.tenantId, pendingAction.kycId!);
                  show({ variant: "success", title: "Pharmacy rejected", description: pendingAction.name });
                  refresh();
                  break;
                case "verify": {
                  const res = await AdminAPI.verifyPayment(pendingAction.tenantId, pendingAction.pendingPayment?.code || undefined);
                  show({ variant: "success", title: "Payment verified", description: `${pendingAction.name} notified` });
                  updateTenant(pendingAction.tenantId, (prev) => ({
                    ...prev,
                    status_category: "active",
                    status_label: "Active",
                    status_priority: 40,
                    subscription: {
                      ...(prev.subscription || {}),
                      blocked: false,
                      status: "active",
                      next_due_date: res?.next_due_date || prev.subscription?.next_due_date || null,
                    },
                    pending_payment: null,
                    pending_payment_code: null,
                    pending_payment_submitted_at: null,
                    latest_payment: {
                      code: pendingAction.pendingPayment?.code || res?.payment_code || prev.latest_payment?.code || prev.latest_payment_code,
                      status: "verified",
                      submitted_at: pendingAction.pendingPayment?.submitted_at || prev.latest_payment?.submitted_at || prev.latest_payment_submitted_at,
                      verified_at: new Date().toISOString(),
                    },
                    latest_payment_code: pendingAction.pendingPayment?.code || res?.payment_code || prev.latest_payment_code,
                    latest_payment_status: "verified",
                    latest_payment_submitted_at: pendingAction.pendingPayment?.submitted_at || prev.latest_payment_submitted_at,
                    latest_payment_verified_at: new Date().toISOString(),
                  }));
                  break;
                }
                case "rejectPayment":
                  await AdminAPI.rejectPayment(pendingAction.tenantId, pendingAction.pendingPayment?.code || undefined);
                  show({ variant: "success", title: "Payment rejected", description: `${pendingAction.name} informed to retry` });
                  refresh();
                  break;
              }
              handleDialogCancel();
            } catch (err: any) {
              show({ variant: "destructive", title: "Action failed", description: err?.message || "Something went wrong" });
            } finally {
              setProcessing(false);
            }
          }}
          options={confirmOptions}
          setOptions={(opts) => setConfirmOptions(opts)}
        />
      )}
    </>
  );
}


function InfoRow({ label, value, description, className, masked }: { label: string; value: React.ReactNode; description?: React.ReactNode; className?: string; masked?: boolean }) {
  const [showValue, setShowValue] = useState(!masked);
  return (
    <div className={cn("space-y-1 rounded border p-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        {masked && (
          <button type="button" className="text-xs text-blue-600 underline" onClick={() => setShowValue((prev) => !prev)}>
            {showValue ? "Hide" : "Show"}
          </button>
        )}
      </div>
      <div className="text-sm font-medium break-all">
        {masked && !showValue ? "••••••••" : value}
      </div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  );
}

function StatusPill({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "muted" | "outline" | "danger" }) {
  const styles =
    tone === "primary"
      ? "bg-blue-100 text-blue-700"
      : tone === "danger"
      ? "bg-red-100 text-red-700"
      : tone === "outline"
      ? "border border-muted-foreground/40 text-muted-foreground"
      : "bg-muted text-muted-foreground";
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles)}>{children}</span>;
}


function ConfirmDialog({
  action,
  onConfirm,
  onCancel,
  loading,
  options,
  setOptions,
}: {
  action: PendingActionState;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  options: ConfirmOptions;
  setOptions: (opts: ConfirmOptions) => void;
}) {
  const copy = {
    approve: {
      title: "Approve pharmacy",
      description: `Are you sure you want to approve ${action.name} and notify them to pay?`,
      confirm: "Yes, approve",
    },
    reject: {
      title: "Reject pharmacy",
      description: `Reject ${action.name}'s application? They will be notified immediately.`,
      confirm: "Yes, reject",
    },
    verify: {
      title: "Verify payment",
      description: `Confirm that ${action.name} has paid and unblock their subscription?`,
      confirm: "Yes, verify",
    },
    rejectPayment: {
      title: "Reject payment",
      description: `Reject ${action.name}'s submitted payment and ask them to retry?`,
      confirm: "Yes, reject payment",
    },
  } as const;

  const meta = copy[action.type];
  const paymentDetails = action.pendingPayment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{meta.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
        {paymentDetails && (action.type === "verify" || action.type === "rejectPayment") && (
          <div className="mt-4 rounded border bg-muted/30 p-3 text-xs">
            <div className="font-medium text-sm mb-1">Pending payment details</div>
            <div className="flex justify-between"><span>Code:</span> <span className="font-mono">{paymentDetails.code}</span></div>
            <div className="flex justify-between"><span>Submitted:</span> <span>{formatDateTime(paymentDetails.submitted_at)}</span></div>
          </div>
        )}
        {action.type === "approve" && (
          <div className="mt-4 space-y-3 border rounded bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium">Issue temporary password</label>
              <input
                type="checkbox"
                checked={Boolean(options.issueTempPassword)}
                onChange={(e) => setOptions({ ...options, issueTempPassword: e.target.checked })}
              />
            </div>
            {options.issueTempPassword && (
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="temp-password-input">Password</label>
                <input
                  id="temp-password-input"
                  type="text"
                  value={options.tempPassword ?? ""}
                  onChange={(e) => setOptions({ ...options, tempPassword: e.target.value })}
                  className="w-full rounded border border-border px-2 py-1 text-sm"
                  placeholder="Auto-generate if left blank"
                />
                <button
                  type="button"
                  className="text-xs text-blue-600 underline"
                  onClick={() => setOptions({ ...options, tempPassword: generatePassword() })}
                >
                  Generate strong password
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : meta.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
