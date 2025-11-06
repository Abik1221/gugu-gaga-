"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, LinkIcon, Pointer, RefreshCw } from "lucide-react";
import { useAffiliateDashboardContext } from "../_context/affiliate-dashboard-context";

export default function GenerateLinkPage() {
    const { links, canCreateMore, actions } = useAffiliateDashboardContext();
    const [refreshing, setRefreshing] = useState(false);

    const createLinkLabel = canCreateMore ? "Generate referral link" : "Link limit reached";
    const activeLinks = links.filter((link) => link.active).length;

    async function refreshAll() {
        setRefreshing(true);
        try {
            await actions.refresh();
        } finally {
            setRefreshing(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button
                    onClick={() => {
                        void actions.createLink();
                    }}
                    disabled={!canCreateMore}
                    className="group h-12 cursor-pointer rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition duration-150 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white transition group-hover:scale-105">
                        <Pointer className="h-4 w-4" />
                    </span>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {createLinkLabel}
                </Button>
                <Button
                    onClick={refreshAll}
                    variant="outline"
                    disabled={refreshing}
                    className="h-11 cursor-pointer rounded-2xl border border-emerald-200/70 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> {refreshing ? "Refreshing..." : "Refresh data"}
                </Button>
            </div>
            <p className="text-xs text-emerald-700/70 mt-3">
                {activeLinks} of 2 active links in use · {canCreateMore ? "Generate a new link to start sharing" : "Deactivate one to free a slot"}
            </p>
            <div className="mt-5 space-y-3">
                {links.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-200/60 bg-emerald-50/50 p-6 text-center text-sm text-emerald-700">
                        <LinkIcon className="h-8 w-8 text-emerald-500" />
                        <p>No referral links yet. Generate one to start sharing.</p>
                    </div>
                ) : (
                    links.map((link) => {
                        const statusClass = link.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600";
                        return (
                            <div
                                key={link.token}
                                className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                        <LinkIcon className="h-4 w-4" /> Referral link
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusClass}`}
                                        >
                                            {link.active ? "Active" : "Inactive"}
                                        </span>
                                    </p>
                                    <p className="break-all font-mono text-xs text-emerald-700/80">{link.url}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            void actions.copyLink(link.url);
                                        }}
                                        className="cursor-pointer rounded-xl border border-emerald-200 bg-white text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                                    >
                                        <Copy className="mr-1.5 h-4 w-4" /> Copy
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            void actions.deactivate(link.token);
                                        }}
                                        disabled={!link.active}
                                        className="cursor-pointer rounded-xl border border-red-200 bg-white text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Deactivate
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            void actions.rotate(link.token);
                                        }}
                                        className="cursor-pointer rounded-xl border border-sky-200 bg-white text-sky-600 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                                    >
                                        <RefreshCw className="mr-1.5 h-4 w-4" /> Rotate
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}