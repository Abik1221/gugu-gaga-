"use client";

import React, { useEffect, useMemo, useState } from "react";

import { AuthAPI, type AuthProfile } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type EditableFields = Pick<AuthProfile, "username" | "first_name" | "last_name" | "phone">;
const editableKeys: Array<keyof EditableFields> = ["username", "first_name", "last_name", "phone"];
type ThemeOption = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "dashboard_theme_preference";
const PREF_STORAGE_KEY = "dashboard_notification_prefs";

function toInputValue(value: string | null | undefined) {
  return value ?? "";
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim();
}

function sanitizePayloadValue(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded border border-gray-200 bg-white/80 p-3">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 break-words">{value}</span>
    </div>
  );
}

export default function DashboardSettingsPage() {
  const { show } = useToast();
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [form, setForm] = useState<Record<keyof EditableFields, string>>({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeOption>("system");
  const [themeLoading, setThemeLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    inventoryAlerts: true,
    securityEmails: true,
  });

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const me = await AuthAPI.me();
        if (!active) return;
        setProfile(me);
        setForm({
          username: toInputValue(me.username),
          first_name: toInputValue(me.first_name),
          last_name: toInputValue(me.last_name),
          phone: toInputValue(me.phone),
        });
        setError(null);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Unable to load profile");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const storedTheme = typeof window !== "undefined" ? (localStorage.getItem(THEME_STORAGE_KEY) as ThemeOption | null) : null;
    const initialTheme: ThemeOption = storedTheme || "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setThemeLoading(false);

    if (typeof window !== "undefined") {
      const storedPrefs = localStorage.getItem(PREF_STORAGE_KEY);
      if (storedPrefs) {
        try {
          const parsed = JSON.parse(storedPrefs) as typeof notifications;
          setNotifications((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore invalid JSON
        }
      }
    }
  }, []);

  useEffect(() => {
    if (themeLoading) return;
    applyTheme(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, themeLoading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const isDirty = useMemo(() => {
    if (!profile) return false;
    return editableKeys.some((key) => normalize(form[key]) !== normalize(profile[key] as string | null | undefined));
  }, [form, profile]);

  const summaryFields = useMemo(() => {
    if (!profile) return [];
    return [
      { label: "Email", value: profile.email },
      { label: "Tenant", value: profile.tenant_id ?? "—" },
      { label: "Role", value: profile.role ?? "—" },
      { label: "KYC Status", value: profile.kyc_status ?? "—" },
      { label: "Subscription", value: profile.subscription_status ?? "—" },
    ];
  }, [profile]);

  const handleChange = (key: keyof EditableFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    if (!profile) return;
    setForm({
      username: toInputValue(profile.username),
      first_name: toInputValue(profile.first_name),
      last_name: toInputValue(profile.last_name),
      phone: toInputValue(profile.phone),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const payload: Partial<Record<keyof EditableFields, string | null>> = {};
    editableKeys.forEach((key) => {
      const next = normalize(form[key]);
      const current = normalize(profile[key] as string | null | undefined);
      if (next !== current) {
        payload[key] = sanitizePayloadValue(form[key]);
      }
    });

    if (Object.keys(payload).length === 0) {
      show({ title: "No changes to save", description: "Update the fields before saving." });
      return;
    }

    setSaving(true);
    try {
      const updated = await AuthAPI.updateProfile(payload);
      setProfile(updated);
      setForm({
        username: toInputValue(updated.username),
        first_name: toInputValue(updated.first_name),
        last_name: toInputValue(updated.last_name),
        phone: toInputValue(updated.phone),
      });
      setError(null);
      show({ variant: "success", title: "Profile updated", description: "Your profile details were saved." });
    } catch (err: any) {
      show({ variant: "destructive", title: "Update failed", description: err?.message || "Unable to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (next: ThemeOption) => {
    setTheme(next);
    show({ variant: "success", title: "Appearance updated", description: `Theme set to ${next}.` });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handlePasswordReset = () => {
    show({
      variant: "default",
      title: "Password reset",
      description: "A password reset link will be available once the security service is connected.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600">Review and update the account details for this user and tenant.</p>
      </div>

      {loading ? (
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle>Loading profile…</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={`form-${idx}`} className="h-16 w-full" />
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={`summary-${idx}`} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border border-red-200 bg-red-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-700">Unable to load profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-700">{error}</div>
          </CardContent>
        </Card>
      ) : !profile ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>No profile data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">We could not retrieve your profile details. Try refreshing the page.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Edit profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-gray-500">
                  Update how your name and contact information appear across the pharmacy tools. Leave a field blank to clear it.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Username</label>
                    <Input value={form.username} onChange={handleChange("username")} placeholder="Preferred username" maxLength={64} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">First name</label>
                    <Input value={form.first_name} onChange={handleChange("first_name")} placeholder="e.g. Alex" maxLength={120} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Last name</label>
                    <Input value={form.last_name} onChange={handleChange("last_name")} placeholder="e.g. Bekele" maxLength={120} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Phone</label>
                    <Input value={form.phone} onChange={handleChange("phone")} placeholder="e.g. +2519..." maxLength={32} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} disabled={!isDirty || saving}>
                    Reset
                  </Button>
                  <Button type="submit" disabled={!isDirty || saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Account summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {summaryFields.map((item) => (
                <ProfileField key={item.label} label={item.label} value={item.value} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500">Choose how the dashboard looks across the app.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ].map((option) => {
                const active = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleThemeChange(option.value as ThemeOption)}
                    className={`rounded border px-3 py-2 text-sm font-medium transition ${
                      active ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-gray-500">These preferences are stored in your browser for now. Backend delivery will be wired soon.</p>
            <label className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2">
              <span>Product updates</span>
              <input type="checkbox" checked={notifications.productUpdates} onChange={() => handleNotificationToggle("productUpdates")} />
            </label>
            <label className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2">
              <span>Inventory alerts</span>
              <input type="checkbox" checked={notifications.inventoryAlerts} onChange={() => handleNotificationToggle("inventoryAlerts")} />
            </label>
            <label className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2">
              <span>Security emails</span>
              <input type="checkbox" checked={notifications.securityEmails} onChange={() => handleNotificationToggle("securityEmails")} />
            </label>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Account security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-xs text-gray-500">
            Looking to reset your password or review active sessions? These controls will appear here as soon as the security service is connected.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePasswordReset}>
              Request password reset
            </Button>
            <Button variant="outline" disabled>
              Manage active sessions (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function applyTheme(theme: ThemeOption) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", shouldUseDark);
  root.dataset.theme = shouldUseDark ? "dark" : "light";
}
