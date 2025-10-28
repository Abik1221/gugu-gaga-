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
    <div className="flex flex-col gap-1 rounded border border-gray-200 bg-white/80 p-3">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 break-words">{value}</span>
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
      { label: "Tenant", value: profile.tenant_id ?? "—" },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Owner settings</h1>
        <p className="text-gray-600">Control profile details, monitor your team, and keep subscription data in one place.</p>
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
            <div className="text-sm text-gray-500">We could not retrieve your owner profile. Please refresh or contact support.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Edit owner profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-gray-500">
                  Update how your name and contact information appear across every pharmacy tool. Leave a field blank to clear it.
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
                    <Input value={form.phone} onChange={handleChange("phone")} placeholder="e.g. +2519…" maxLength={32} />
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
              <CardTitle>Tenant & subscription overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {summaryFields.map((item) => (
                <ProfileField key={item.label} label={item.label} value={item.value} />
              ))}
              <Link
                href="/dashboard/owner/payment"
                className="inline-flex items-center justify-center rounded border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Review subscription & payments
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Team insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {staffLoading ? (
            <div className="grid gap-3 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={`staff-${idx}`} className="h-20 w-full" />
              ))}
            </div>
          ) : staffError ? (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{staffError}</div>
          ) : staff.length === 0 ? (
            <div className="rounded border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
              No staff members found for this tenant yet. Invite your first cashier or manager to get started.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <ProfileField label="Total staff" value={staffStats.total} />
                <ProfileField label="Active" value={staffStats.active} />
                <ProfileField label="Inactive" value={staffStats.inactive} />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase text-gray-500">Recent members</div>
                <div className="space-y-2">
                  {topStaff.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col gap-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{member.email}</div>
                        <div className="text-xs text-gray-500 capitalize">{member.role || "staff"}</div>
                      </div>
                      <span
                        className={`inline-flex h-6 items-center justify-center rounded-full px-3 text-xs font-medium ${
                          member.is_active === false ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/owner/staff"
              className="inline-flex items-center justify-center rounded border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Manage staff access
            </Link>
            <Link
              href="/dashboard/owner/staff/new"
              className="inline-flex items-center justify-center rounded border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Invite new member
            </Link>
            <Link
              href="/dashboard/inventory"
              className="inline-flex items-center justify-center rounded border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Review inventory settings
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Appearance</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => handleThemeChange("system")}>Reset</Button>
            </div>
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

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Account security</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={refreshSessions} disabled={sessionsLoading}>
                  Refresh sessions
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <form onSubmit={handlePasswordChange} className="space-y-2">
              <p className="text-xs text-gray-500">
                Change your password. All other active sessions will be signed out immediately.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  type="password"
                  placeholder="Current password"
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              {passwordError ? <div className="text-xs text-red-600">{passwordError}</div> : null}
              <div className="flex justify-end">
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? "Updating…" : "Change password"}
                </Button>
              </div>
            </form>
            {sessionsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={`session-${idx}`} className="h-16 w-full" />
                ))}
              </div>
            ) : sessionsError ? (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{sessionsError}</div>
            ) : sessions.length === 0 ? (
              <div className="rounded border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                No active sessions found. Devices will appear here after logging in.
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded border px-3 py-3 text-sm ${session.is_current ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {session.user_agent || "Unknown device"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.ip_address ? `IP ${session.ip_address}` : "IP unknown"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.is_current && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Current</span>}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={session.is_current || session.is_revoked || revokingSessionId === session.id}
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          {session.is_revoked ? "Revoked" : revokingSessionId === session.id ? "Revoking…" : "Revoke"}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-gray-500 sm:grid-cols-3">
                      <span>Created: {new Date(session.created_at).toLocaleString()}</span>
                      <span>Last seen: {new Date(session.last_seen_at).toLocaleString()}</span>
                      <span>Expires: {new Date(session.expires_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity log</CardTitle>
              <Button variant="outline" size="sm" onClick={refreshActivity} disabled={activityLoading}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-gray-500">
              Recent sessions, staff updates, and other tenant-level actions are listed here. Use this to monitor how the system is used.
            </p>
            {activityLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={`activity-${idx}`} className="h-14 w-full" />
                ))}
              </div>
            ) : activityError ? (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{activityError}</div>
            ) : activity.length === 0 ? (
              <div className="rounded border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                No activity recorded yet. Actions such as staff changes or logins will appear here.
              </div>
            ) : (
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="rounded border border-gray-200 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wide text-emerald-700">{item.action}</span>
                      <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 font-medium text-gray-900">{item.message}</div>
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      {item.target_type && (
                        <div>
                          Target: {item.target_type}
                          {item.target_id ? ` • ${item.target_id}` : ""}
                        </div>
                      )}
                      {item.actor_user_id ? <div>Actor ID: {item.actor_user_id}</div> : null}
                      {item.metadata ? <pre className="whitespace-pre-wrap rounded bg-gray-50 p-2 text-[11px] text-gray-600">{JSON.stringify(item.metadata, null, 2)}</pre> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
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
