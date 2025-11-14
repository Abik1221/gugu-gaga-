"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AuthAPI,
  StaffAPI,
  TenantAPI,
  type AuthProfile,
  type SessionInfo,
  type TenantActivityRecord,
} from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type EditableFields = Pick<AuthProfile, "username" | "first_name" | "last_name" | "phone">;
type ThemeOption = "light" | "dark" | "system";

type StaffMember = {
  id: number;
  email: string;
  role?: string | null;
  phone?: string | null;
  is_active?: boolean | null;
};

const editableKeys: Array<keyof EditableFields> = ["username", "first_name", "last_name", "phone"];
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
    <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="break-words text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function OwnerSettingsPage() {
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

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [revokingSessionId, setRevokingSessionId] = useState<number | null>(null);

  const [activity, setActivity] = useState<TenantActivityRecord[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  const [theme, setTheme] = useState<ThemeOption>("system");
  const [themeLoading, setThemeLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    inventoryAlerts: true,
    securityEmails: true,
  });
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [showActivityDetails, setShowActivityDetails] = useState(false);

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
    if (!profile?.tenant_id) {
      setStaff([]);
      setStaffLoading(false);
      setSessions([]);
      setSessionsLoading(false);
      setActivity([]);
      setActivityLoading(false);
      return;
    }
    let active = true;
    setStaffLoading(true);
    setStaffError(null);
    StaffAPI.list(profile.tenant_id)
      .then((rows) => {
        if (!active) return;
        setStaff(Array.isArray(rows) ? rows : []);
      })
      .catch((err: any) => {
        if (!active) return;
        setStaffError(err?.message || "Unable to load staff");
      })
      .finally(() => {
        if (active) setStaffLoading(false);
      });

    setSessionsLoading(true);
    setSessionsError(null);
    AuthAPI.sessions()
      .then((items) => {
        if (!active) return;
        setSessions(items);
      })
      .catch((err: any) => {
        if (!active) return;
        setSessionsError(err?.message || "Unable to load sessions");
      })
      .finally(() => {
        if (active) setSessionsLoading(false);
      });

    setActivityLoading(true);
    setActivityError(null);
    TenantAPI.activity({ limit: 25 })
      .then((records) => {
        if (!active) return;
        setActivity(records);
      })
      .catch((err: any) => {
        if (!active) return;
        setActivityError(err?.message || "Unable to load activity log");
      })
      .finally(() => {
        if (active) setActivityLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profile?.tenant_id]);

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

      { label: "Primary role", value: profile.role ?? "—" },
      { label: "KYC status", value: profile.kyc_status ?? "—" },
      { label: "Subscription", value: profile.subscription_status ?? "—" },
      { label: "Next due date", value: profile.subscription_next_due_date ?? "—" },
      { label: "Latest payment", value: profile.latest_payment_status ?? "—" },
    ];
  }, [profile]);

  const staffStats = useMemo(() => {
    const activeCount = staff.filter((member) => member.is_active !== false).length;
    const inactiveCount = staff.length - activeCount;
    return {
      total: staff.length,
      active: activeCount,
      inactive: inactiveCount,
    };
  }, [staff]);

  const topStaff = useMemo(() => staff.slice(0, 5), [staff]);

  const currentSession = useMemo(() => {
    if (sessions.length === 0) return null;
    return sessions.find((session) => session.is_current) ?? sessions[0];
  }, [sessions]);

  const latestActivity = useMemo(() => (activity.length > 0 ? activity[0] : null), [activity]);

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

  const refreshSessions = async () => {
    if (!profile?.tenant_id) return;
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const items = await AuthAPI.sessions();
      setSessions(items);
    } catch (err: any) {
      setSessionsError(err?.message || "Unable to refresh sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    setRevokingSessionId(sessionId);
    try {
      await AuthAPI.revokeSession(sessionId);
      await refreshSessions();
      show({
        variant: "success",
        title: "Session revoked",
        description: "The device was disconnected successfully.",
      });
    } catch (err: any) {
      show({ variant: "destructive", title: "Failed to revoke", description: err?.message || "Unable to revoke session" });
    } finally {
      setRevokingSessionId(null);
    }
  };

  const refreshActivity = async () => {
    if (!profile?.tenant_id) return;
    setActivityLoading(true);
    setActivityError(null);
    try {
      const records = await TenantAPI.activity({ limit: 25 });
      setActivity(records);
    } catch (err: any) {
      setActivityError(err?.message || "Unable to load activity log");
    } finally {
      setActivityLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    if (!passwordCurrent || !passwordNew || !passwordConfirm) {
      setPasswordError("Enter current password, new password, and confirmation.");
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordError(null);
    setChangingPassword(true);
    try {
      await AuthAPI.changePassword({ current_password: passwordCurrent, new_password: passwordNew });
      setPasswordCurrent("");
      setPasswordNew("");
      setPasswordConfirm("");
      show({ variant: "success", title: "Password updated", description: "Other devices have been signed out." });
      await refreshSessions();
    } catch (err: any) {
      setPasswordError(err?.message || "Unable to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Owner Settings</h1>
          <p className="mt-2 text-slate-600">Control profile details, monitor your team, and keep subscription data in one place.</p>
        </div>

        {loading ? (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Loading profile…</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`form-${idx}`} className="h-16 w-full rounded-xl bg-slate-100" />
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`summary-${idx}`} className="h-16 w-full rounded-xl bg-slate-100" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="rounded-2xl border border-red-200 bg-red-50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-800">Unable to load profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-700">{error}</div>
            </CardContent>
          </Card>
        ) : !profile ? (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">No profile data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">We could not retrieve your owner profile. Please refresh or contact support.</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Edit Owner Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-sm text-slate-600">
                    Update how your name and contact information appear across every pharmacy tool. Leave a field blank to clear it.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Username</label>
                      <Input 
                        value={form.username} 
                        onChange={handleChange("username")} 
                        placeholder="Preferred username" 
                        maxLength={64} 
                        className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">First Name</label>
                      <Input 
                        value={form.first_name} 
                        onChange={handleChange("first_name")} 
                        placeholder="e.g. Alex" 
                        maxLength={120} 
                        className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Last Name</label>
                      <Input 
                        value={form.last_name} 
                        onChange={handleChange("last_name")} 
                        placeholder="e.g. Bekele" 
                        maxLength={120} 
                        className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone</label>
                      <Input 
                        value={form.phone} 
                        onChange={handleChange("phone")} 
                        placeholder="e.g. +2519…" 
                        maxLength={32} 
                        className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm} 
                      disabled={!isDirty || saving} 
                      className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!isDirty || saving} 
                      className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Tenant & Subscription Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {summaryFields.map((item) => (
                  <ProfileField key={item.label} label={item.label} value={item.value} />
                ))}
                <Link
                  href="/dashboard/owner/payment"
                  className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Review Subscription & Payments
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Team Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {staffLoading ? (
              <div className="grid gap-3 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={`staff-${idx}`} className="h-20 w-full rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : staffError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{staffError}</div>
            ) : staff.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No staff members found for this tenant yet. Invite your first cashier or manager to get started.
              </div>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <ProfileField label="Total staff" value={staffStats.total} />
                  <ProfileField label="Active" value={staffStats.active} />
                  <ProfileField label="Inactive" value={staffStats.inactive} />
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">Recent Members</div>
                  <div className="space-y-2">
                    {topStaff.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{member.email}</div>
                          <div className="text-xs text-slate-500 capitalize">{(member.role || "staff").toLowerCase()}</div>
                        </div>
                        <span
                          className={`inline-flex h-6 items-center justify-center rounded-full px-3 text-xs font-medium ${
                            member.is_active === false
                              ? "border border-red-200 bg-red-100 text-red-700"
                              : "border border-green-200 bg-green-100 text-green-700"
                          }`}
                        >
                          {member.is_active === false ? "Suspended" : "Active"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/owner/staff"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Manage Staff Access
              </Link>
              <Link
                href="/dashboard/owner/staff/new"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Invite New Member
              </Link>
              <Link
                href="/dashboard/inventory"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Review Inventory Settings
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Appearance</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-lg text-slate-600 hover:bg-slate-100" 
                  onClick={() => handleThemeChange("system")}
                >
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">Choose how the dashboard looks across the app.</p>
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
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">Preferences are stored locally while backend delivery is in progress.</p>
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-slate-700">Product updates</span>
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 accent-emerald-600" 
                    checked={notifications.productUpdates} 
                    onChange={() => handleNotificationToggle("productUpdates")} 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-slate-700">Inventory alerts</span>
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 accent-emerald-600" 
                    checked={notifications.inventoryAlerts} 
                    onChange={() => handleNotificationToggle("inventoryAlerts")} 
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-slate-700">Security emails</span>
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 accent-emerald-600" 
                    checked={notifications.securityEmails} 
                    onChange={() => handleNotificationToggle("securityEmails")} 
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Account Security</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshSessions}
                  disabled={sessionsLoading}
                  className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Refresh Sessions
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <p className="text-sm text-slate-600">
                  Change your password. All other active sessions will be signed out immediately.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={passwordCurrent}
                    onChange={(e) => setPasswordCurrent(e.target.value)}
                    required
                    className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                    required
                    className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                {passwordError ? <div className="text-sm text-red-600">{passwordError}</div> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {changingPassword ? "Updating…" : "Change Password"}
                  </Button>
                </div>
              </form>
              
              <div className="space-y-4">
                {sessionsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <Skeleton key={`session-${idx}`} className="h-16 w-full rounded-xl bg-slate-100" />
                    ))}
                  </div>
                ) : sessionsError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{sessionsError}</div>
                ) : sessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    No active sessions found. Devices will appear here after logging in.
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Session</p>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {currentSession?.user_agent || "Unknown device"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {currentSession?.ip_address ? `IP ${currentSession.ip_address}` : "IP unknown"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentSession?.is_current && (
                          <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Current
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentSession?.is_current || !currentSession || currentSession.is_revoked || revokingSessionId === currentSession.id}
                          onClick={() => currentSession && handleRevokeSession(currentSession.id)}
                          className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        >
                          {currentSession?.is_revoked
                            ? "Revoked"
                            : revokingSessionId === currentSession?.id
                            ? "Revoking…"
                            : "Sign Out"}
                        </Button>
                      </div>
                    </div>
                    {currentSession ? (
                      <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                        <span>Created: {new Date(currentSession.created_at).toLocaleString()}</span>
                        <span>Last seen: {new Date(currentSession.last_seen_at).toLocaleString()}</span>
                        <span>Expires: {new Date(currentSession.expires_at).toLocaleString()}</span>
                      </div>
                    ) : null}
                    {sessions.length > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          {sessions.length - 1} other session{sessions.length - 1 === 1 ? "" : "s"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSessionDetails((prev) => !prev)}
                          className="rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          {showSessionDetails ? "Hide Details" : "View Details"}
                        </Button>
                      </div>
                    )}
                    {showSessionDetails && (
                      <div className="mt-4 space-y-3">
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            className={`rounded-xl border px-3 py-3 text-sm ${
                              session.is_current
                                ? "border-green-200 bg-green-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="font-semibold text-slate-900">{session.user_agent || "Unknown device"}</div>
                                <div className="text-xs text-slate-500">
                                  {session.ip_address ? `IP ${session.ip_address}` : "IP unknown"}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {session.is_current && (
                                  <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                    Current
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={session.is_current || session.is_revoked || revokingSessionId === session.id}
                                  onClick={() => handleRevokeSession(session.id)}
                                  className="rounded-lg text-slate-600 hover:bg-slate-100"
                                >
                                  {session.is_revoked ? "Revoked" : revokingSessionId === session.id ? "Revoking…" : "Revoke"}
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                              <span>Created: {new Date(session.created_at).toLocaleString()}</span>
                              <span>Last seen: {new Date(session.last_seen_at).toLocaleString()}</span>
                              <span>Expires: {new Date(session.expires_at).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Activity Log</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshActivity}
                  disabled={activityLoading}
                  className="rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Monitor recent sessions, staff updates, and tenant-level actions.
              </p>
              {activityLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={`activity-${idx}`} className="h-14 w-full rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : activityError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{activityError}</div>
              ) : activity.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No activity recorded yet. Actions such as staff changes or logins will appear here.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Latest Event</p>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{latestActivity?.message}</div>
                      <div className="text-xs text-slate-500">
                        {latestActivity?.action} • {latestActivity ? new Date(latestActivity.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowActivityDetails((prev) => !prev)}
                      className="rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      {showActivityDetails ? "Hide Log" : "View Log"}
                    </Button>
                  </div>
                  {showActivityDetails && (
                    <ul className="mt-4 space-y-3">
                      {activity.map((item) => (
                        <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase text-slate-600">{item.action}</span>
                            <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                          </div>
                          <div className="mt-1 font-semibold text-slate-900">{item.message}</div>
                          <div className="mt-1 space-y-1 text-xs text-slate-500">
                            {item.target_type && (
                              <div>
                                Target: {item.target_type}
                                {item.target_id ? ` • ${item.target_id}` : ""}
                              </div>
                            )}
                            {item.actor_user_id ? <div>Actor ID: {item.actor_user_id}</div> : null}
                            {item.metadata ? (
                              <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                                {JSON.stringify(item.metadata, null, 2)}
                              </pre>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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