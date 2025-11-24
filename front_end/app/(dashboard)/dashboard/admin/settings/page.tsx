"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

type SystemSetting = {
    key: string;
    value: string;
    description?: string;
    updated_at?: string;
};

export default function GlobalSettingsPage() {
    const { show } = useToast();
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const data = await AdminAPI.system.settings();
            setSettings(data as SystemSetting[]);
        } catch (error) {
            show({ variant: "destructive", title: "Error", description: "Failed to load settings" });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(key: string, value: string, description?: string) {
        setSaving(key);
        try {
            await AdminAPI.system.updateSetting(key, value, description);
            show({ variant: "success", title: "Saved", description: `Setting ${key} updated.` });
            loadSettings(); // Reload to confirm
        } catch (error) {
            show({ variant: "destructive", title: "Error", description: "Failed to save setting" });
        } finally {
            setSaving(null);
        }
    }

    if (loading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

    const defaultSettings = [
        { key: "maintenance_mode", label: "Maintenance Mode", default: "false", desc: "Set to 'true' to block user access." },
        { key: "allow_registration", label: "Allow Registration", default: "true", desc: "Set to 'false' to disable new signups." },
        { key: "support_email", label: "Support Email", default: "support@mesobai.com", desc: "Email displayed to users." },
    ];

    // Merge defaults with loaded settings
    const mergedSettings = defaultSettings.map(def => {
        const existing = settings.find(s => s.key === def.key);
        return {
            ...def,
            value: existing ? existing.value : def.default,
            description: existing ? existing.description : def.desc,
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Global Settings</h1>
                    <p className="mt-2 text-slate-600">Manage system-wide configurations and feature flags.</p>
                </div>

                <div className="grid gap-6">
                    {mergedSettings.map((setting) => (
                        <SettingCard
                            key={setting.key}
                            setting={setting}
                            onSave={handleSave}
                            isSaving={saving === setting.key}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SettingCard({
    setting,
    onSave,
    isSaving,
}: {
    setting: { key: string; label: string; value: string; description?: string };
    onSave: (key: string, value: string, description?: string) => void;
    isSaving: boolean;
}) {
    const [value, setValue] = useState(setting.value);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setValue(setting.value);
        setDirty(false);
    }, [setting.value]);

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-900">{setting.label}</CardTitle>
                <p className="text-sm text-slate-500">{setting.description}</p>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <Input
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setDirty(true);
                        }}
                        className="max-w-md"
                    />
                    <Button
                        onClick={() => onSave(setting.key, value, setting.description)}
                        disabled={!dirty || isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
