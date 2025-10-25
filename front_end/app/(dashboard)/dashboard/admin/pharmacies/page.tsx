"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminPharmaciesPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: "approve" | "reject" | "verify" | "rejectPayment";
    tenantId: string;
    name: string;
    kycId?: number | null;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  async function refresh(page = 1) {
    setLoading(true);
    try {
      const data = await AdminAPI.pharmacies(page, 20, q);
      setItems(data.items || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load pharmacies");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  return (
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
      ) : (
        <div className="grid gap-4">
          {items.map((ph) => {
            const kycStatus = ph.kyc_status ? ph.kyc_status.toUpperCase() : "UNKNOWN";
            const isPending = ph.kyc_status === "pending";
            const isBlocked = !!ph.subscription?.blocked;
            const isSelected = selectedTenant === ph.tenant_id;

            return (
              <Card key={ph.id} className={cn("transition-shadow", isSelected && "border-blue-500 shadow-lg")}
                onClick={() => setSelectedTenant(ph.tenant_id)}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{ph.name}</CardTitle>
                    <div className="text-xs text-muted-foreground font-mono">{ph.tenant_id}</div>
                  </div>
                  <div className="flex gap-2">
                    <StatusPill tone={isPending ? "primary" : "muted"}>{kycStatus}</StatusPill>
                    {ph.owner_approved && <StatusPill tone="outline">Owner approved</StatusPill>}
                    {isBlocked && <StatusPill tone="danger">Subscription blocked</StatusPill>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <InfoRow label="Owner" value={ph.owner_email || "-"} description={ph.owner_phone} />
                    <InfoRow label="Created" value={ph.created_at ? new Date(ph.created_at).toLocaleString() : "-"} />
                    <InfoRow label="Address" value={ph.address || "-"} className="md:col-span-2" />
                    <InfoRow
                      label="Subscription"
                      value={isBlocked ? "Blocked" : "Active"}
                      description={ph.subscription?.next_due_date ? `Next due: ${new Date(ph.subscription.next_due_date).toLocaleDateString()}` : undefined}
                    />
                    <InfoRow
                      label="Latest Payment"
                      value={ph.latest_payment_code || "—"}
                      description={ph.latest_payment_status ? `${ph.latest_payment_status.toUpperCase()} · ${ph.latest_payment_submitted_at ? new Date(ph.latest_payment_submitted_at).toLocaleString() : "submitted"}` : undefined}
                    />
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      disabled={!isPending || !ph.kyc_id}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setPendingAction({ type: "approve", tenantId: ph.tenant_id, kycId: ph.kyc_id, name: ph.name });
                      }}
                    >Approve & Notify</Button>
                    <Button
                      variant="outline"
                      disabled={!ph.kyc_id}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setPendingAction({ type: "reject", tenantId: ph.tenant_id, kycId: ph.kyc_id, name: ph.name });
                      }}
                    >Reject</Button>
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingAction({ type: "verify", tenantId: ph.tenant_id, name: ph.name });
                      }}
                    >Verify Payment</Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingAction({ type: "rejectPayment", tenantId: ph.tenant_id, name: ph.name });
                      }}
                    >Reject Payment</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {items.length === 0 && (
            <div className="border rounded p-6 text-center text-gray-500">No pharmacies found.</div>
          )}
        </div>
      )}
    </div>

    {pendingAction && (
      <ConfirmDialog
        action={pendingAction}
        loading={processing}
        onCancel={() => (processing ? null : setPendingAction(null))}
        onConfirm={async () => {
          if (processing) return;
          setProcessing(true);
          try {
            switch (pendingAction.type) {
              case "approve":
                await AdminAPI.approvePharmacy(pendingAction.tenantId, pendingAction.kycId!);
                show({ variant: "success", title: "Pharmacy approved", description: `${pendingAction.name} will be notified to pay` });
                break;
              case "reject":
                await AdminAPI.rejectPharmacy(pendingAction.tenantId, pendingAction.kycId!);
                show({ variant: "success", title: "Pharmacy rejected", description: pendingAction.name });
                break;
              case "verify":
                await AdminAPI.verifyPayment(pendingAction.tenantId);
                show({ variant: "success", title: "Payment verified", description: `${pendingAction.name} notified` });
                break;
              case "rejectPayment":
                await AdminAPI.rejectPayment(pendingAction.tenantId);
                show({ variant: "success", title: "Payment rejected", description: `${pendingAction.name} informed to retry` });
                break;
            }
            setPendingAction(null);
            refresh();
          } catch (err: any) {
            show({ variant: "destructive", title: "Action failed", description: err?.message || "Something went wrong" });
          } finally {
            setProcessing(false);
          }
        }}
      />
    )}
  );
}


function InfoRow({ label, value, description, className }: { label: string; value: React.ReactNode; description?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1 rounded border p-3", className)}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium break-all">{value}</div>
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
}: {
  action: { type: "approve" | "reject" | "verify" | "rejectPayment"; name: string };
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{meta.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
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
