"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { IntegrationsAPI, type IntegrationConnectionOut, type IntegrationProviderOut } from "@/utils/api";
import { AuthAPI } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type ConnectState = {
  provider: IntegrationProviderOut;
  selectedResources: Set<string>;
};

export default function OwnerIntegrationsPage() {
  const { show } = useToast();

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [providers, setProviders] = useState<IntegrationProviderOut[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  const [connections, setConnections] = useState<IntegrationConnectionOut[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);

  const [connectSheet, setConnectSheet] = useState<ConnectState | null>(null);
  const [startingOAuth, setStartingOAuth] = useState(false);
  const [syncingKey, setSyncingKey] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await AuthAPI.me();
        if (!active) return;
        const tid = profile?.tenant_id || null;
        setTenantId(tid);
      } catch (error: any) {
        if (!active) return;
        setTenantId(null);
        show({ variant: "destructive", title: "Access denied", description: error?.message || "You are not authorised to manage integrations." });
      } finally {
        if (active) setLoadingProfile(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [show]);

  useEffect(() => {
    let active = true;
    (async () => {
      setProvidersLoading(true);
      try {
        const items = await IntegrationsAPI.listProviders();
        if (!active) return;
        setProviders(items);
      } catch (error: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Unable to load tools", description: error?.message || "Could not fetch available integrations." });
      } finally {
        if (active) setProvidersLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [show]);

  useEffect(() => {
    if (!tenantId) {
      setConnections([]);
      setConnectionsLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setConnectionsLoading(true);
      try {
        const items = await IntegrationsAPI.listConnections(tenantId);
        if (!active) return;
        setConnections(items);
      } catch (error: any) {
        if (!active) return;
        show({ variant: "destructive", title: "Unable to load connections", description: error?.message || "Could not fetch your linked tools." });
      } finally {
        if (active) setConnectionsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tenantId, show]);

  const providerMap = useMemo(() => {
    const map = new Map<string, IntegrationProviderOut>();
    providers.forEach((provider) => {
      map.set(provider.key, provider);
    });
    return map;
  }, [providers]);

  const openConnectSheet = (provider: IntegrationProviderOut) => {
    const defaults = new Set(provider.capability.resources);
    setConnectSheet({ provider, selectedResources: defaults });
  };

  const toggleResourceSelection = (resource: string, checked: boolean) => {
    setConnectSheet((prev) => {
      if (!prev) return prev;
      const next = new Set(prev.selectedResources);
      if (checked) next.add(resource);
      else next.delete(resource);
      return { ...prev, selectedResources: next };
    });
  };

  const startOAuth = async () => {
    if (!connectSheet || !tenantId) return;
    setStartingOAuth(true);
    try {
      const resources = Array.from(connectSheet.selectedResources);
      const response = await IntegrationsAPI.startOAuth(
        tenantId,
        connectSheet.provider.key,
        resources.length > 0 ? resources : undefined,
      );
      window.location.href = response.authorization_url;
      show({ variant: "success", title: "Continue in new tab", description: "Complete the provider connection flow and you will be redirected back." });
    } catch (error: any) {
      show({ variant: "destructive", title: "Unable to start connection", description: error?.message || "Check your credentials and try again." });
    } finally {
      setStartingOAuth(false);
    }
  };

  const refreshConnections = async () => {
    if (!tenantId) return;
    setConnectionsLoading(true);
    try {
      const items = await IntegrationsAPI.listConnections(tenantId);
      setConnections(items);
    } catch (error: any) {
      show({ variant: "destructive", title: "Refresh failed", description: error?.message || "Could not update connection list." });
    } finally {
      setConnectionsLoading(false);
    }
  };

  const handleDisconnect = async (connectionId: number) => {
    if (!tenantId) return;
    setDisconnectingId(connectionId);
    try {
      await IntegrationsAPI.disconnect(tenantId, connectionId);
      show({ variant: "success", title: "Connection removed", description: "This tool no longer syncs with your dashboard." });
      await refreshConnections();
    } catch (error: any) {
      show({ variant: "destructive", title: "Unable to disconnect", description: error?.message || "Please try again." });
    } finally {
      setDisconnectingId(null);
    }
  };

  const handleSync = async (connection: IntegrationConnectionOut, resource: string, direction: "incoming" | "outgoing") => {
    if (!tenantId) return;
    const key = `${connection.id}-${resource}-${direction}`;
    setSyncingKey(key);
    try {
      await IntegrationsAPI.triggerSync(tenantId, connection.id, resource, direction);
      const verb = direction === "incoming" ? "Import" : "Sync";
      show({ variant: "success", title: `${verb} scheduled`, description: `${verb} for ${resource} has been queued.` });
      await refreshConnections();
    } catch (error: any) {
      show({ variant: "destructive", title: "Sync failed", description: error?.message || "Could not queue the sync job." });
    } finally {
      setSyncingKey(null);
    }
  };

  const loading = loadingProfile || providersLoading;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-md lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Tool integrations</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            Connect your favourite tools to keep inventory, sales, and supplier data perfectly in sync. You stay in control—connect, import, and disconnect with a single click.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={refreshConnections} disabled={connectionsLoading || !tenantId}>
            Refresh connections
          </Button>
          <Link href="/dashboard/owner">
            <Button variant="ghost">Back to owner dashboard</Button>
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Available tools</h2>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No integrations are available yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => {
              const description = provider.capability.supports_delta_sync
                ? "Two-way sync available"
                : "Manual import & export";
              return (
                <Card key={provider.key} className="border border-slate-200 bg-white shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">{provider.name}</CardTitle>
                    <p className="text-sm text-slate-600 capitalize">{provider.category}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-slate-700 font-semibold">Resources</div>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {provider.capability.resources.map((resource) => (
                        <li key={resource}>{resource}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-600">{description}</p>
                    <Button className="w-full bg-gray-400 hover:bg-gray-500 text-white" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Connected tools</h2>
        </div>
        {connectionsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : connections.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            You have not connected any tools yet. Pick one above to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => {
              const provider = providerMap.get(connection.provider_key);
              const resources = provider?.capability.resources || [];
              return (
                <Card key={connection.id} className="border border-slate-200 bg-white shadow-md">
                  <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-slate-900">{connection.provider_name}</CardTitle>
                      <p className="text-sm text-slate-600">Connected as {connection.display_name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span>Status: <strong className="text-emerald-700">{connection.status}</strong></span>
                      {connection.updated_at && <span>Updated {new Date(connection.updated_at).toLocaleString()}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resources.length === 0 ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        This provider is connected but no data resources are available yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-xs uppercase tracking-wider text-slate-700 font-semibold">Sync actions</div>
                        {resources.map((resource) => {
                          const incomingKey = `${connection.id}-${resource}-incoming`;
                          const outgoingKey = `${connection.id}-${resource}-outgoing`;
                          return (
                            <div key={resource} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{resource}</div>
                                <p className="text-xs text-slate-600">Import data into Zemen or push updates back to {connection.provider_name}.</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSync(connection, resource, "incoming")}
                                  disabled={syncingKey === incomingKey}
                                >
                                  {syncingKey === incomingKey ? "Importing..." : "Import"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSync(connection, resource, "outgoing")}
                                  disabled={syncingKey === outgoingKey}
                                >
                                  {syncingKey === outgoingKey ? "Syncing..." : "Push updates"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={disconnectingId === connection.id}
                      >
                        {disconnectingId === connection.id ? "Disconnecting..." : "Disconnect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Sheet open={!!connectSheet} onOpenChange={(open) => !open && setConnectSheet(null)}>
        <SheetContent className="space-y-6">
          <SheetHeader>
            <SheetTitle>Connect {connectSheet?.provider.name}</SheetTitle>
            <SheetDescription>
              Choose the data you want to sync into your dashboard. You can always change this later.
            </SheetDescription>
          </SheetHeader>
          {connectSheet && (
            <div className="space-y-4">
              <div className="space-y-2">
                {connectSheet.provider.capability.resources.map((resource) => {
                  const checked = connectSheet.selectedResources.has(resource);
                  return (
                    <label key={resource} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/40 bg-transparent"
                        checked={checked}
                        onChange={(event) => toggleResourceSelection(resource, event.target.checked)}
                      />
                      <span>{resource}</span>
                    </label>
                  );
                })}
              </div>
              {!connectSheet.provider.requires_oauth && (
                <div className="rounded-xl border border-white/10 bg-amber-500/10 p-3 text-sm text-amber-100">
                  This provider allows manual API tokens. OAuth is optional.
                </div>
              )}
            </div>
          )}
          <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setConnectSheet(null)} disabled={startingOAuth}>
              Cancel
            </Button>
            <Button onClick={startOAuth} disabled={startingOAuth || !tenantId}>
              {startingOAuth ? "Redirecting..." : "Continue to provider"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
