"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Database, Server, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

type SystemHealth = {
    cpu_percent: number;
    memory_percent: number;
    disk_percent: number;
    db_status: string;
    redis_status: string;
};

export default function SystemHealthPage() {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const data = await AdminAPI.system.health();
                setHealth(data as SystemHealth);
            } catch (error) {
                console.error("Failed to fetch system health", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading && !health) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!health) return <div className="p-6 text-red-500">Failed to load system health.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">System Health</h1>
                        <p className="mt-2 text-slate-600">Real-time monitoring of system resources and services.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        Live Updates
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <HealthCard
                        title="CPU Usage"
                        value={`${health.cpu_percent}%`}
                        icon={<Activity className="h-5 w-5 text-blue-600" />}
                        status={health.cpu_percent > 80 ? "warning" : "healthy"}
                        progress={health.cpu_percent}
                    />
                    <HealthCard
                        title="Memory Usage"
                        value={`${health.memory_percent}%`}
                        icon={<Server className="h-5 w-5 text-purple-600" />}
                        status={health.memory_percent > 85 ? "warning" : "healthy"}
                        progress={health.memory_percent}
                    />
                    <HealthCard
                        title="Disk Usage"
                        value={`${health.disk_percent}%`}
                        icon={<HardDrive className="h-5 w-5 text-slate-600" />}
                        status={health.disk_percent > 90 ? "danger" : "healthy"}
                        progress={health.disk_percent}
                    />
                    <ServiceStatusCard
                        title="Database"
                        status={health.db_status}
                        icon={<Database className="h-5 w-5 text-emerald-600" />}
                    />
                    <ServiceStatusCard
                        title="Redis Cache"
                        status={health.redis_status}
                        icon={<Database className="h-5 w-5 text-red-600" />}
                    />
                </div>
            </div>
        </div>
    );
}

function HealthCard({
    title,
    value,
    icon,
    status,
    progress,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    status: "healthy" | "warning" | "danger";
    progress: number;
}) {
    const statusColors = {
        healthy: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-red-500",
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-500", statusColors[status])}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function ServiceStatusCard({
    title,
    status,
    icon,
}: {
    title: string;
    status: string;
    icon: React.ReactNode;
}) {
    const isConnected = status === "connected";
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            isConnected ? "bg-emerald-500" : "bg-red-500"
                        )}
                    />
                    <div className="text-lg font-semibold capitalize text-slate-900">
                        {status.replace("_", " ")}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
