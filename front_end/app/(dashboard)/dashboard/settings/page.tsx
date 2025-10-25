// Dashboard settings page
"use client";
import React, { useEffect, useState } from "react";
import { getAuthJSON, postAuthJSON } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Me = {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  tenant_id?: string;
};

export default function DashboardSettingsPage() {
  const { show } = useToast();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAuthJSON<Me>("/api/v1/auth/me");
        if (!active) return;
        setMe(data);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load profile");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    if (!currentPassword || !newPassword) {
      show({ variant: "destructive", title: "Missing fields", description: "Enter current and new password" });
      return;
    }
    setChanging(true);
    try {
      await postAuthJSON(`/api/v1/users/${me.id}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      show({ variant: "success", title: "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      show({ variant: "destructive", title: "Change failed", description: e.message || "" });
    } finally {
      setChanging(false);
    }
  }

  if (loading) return <div className="text-gray-500">Loading settings...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <section className="border rounded bg-white">
        <div className="border-b p-4 font-medium">Profile</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Username</div>
            <div className="font-medium">{me?.username}</div>
          </div>
          <div>
            <div className="text-gray-500">Email</div>
            <div className="font-medium">{me?.email}</div>
          </div>
          <div>
            <div className="text-gray-500">First Name</div>
            <div className="font-medium">{me?.first_name || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500">Last Name</div>
            <div className="font-medium">{me?.last_name || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500">Phone</div>
            <div className="font-medium">{me?.phone_number || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500">Tenant</div>
            <div className="font-medium">{me?.tenant_id || "-"}</div>
          </div>
        </div>
      </section>

      <section className="border rounded bg-white">
        <div className="border-b p-4 font-medium">Change Password</div>
        <form onSubmit={onChangePassword} className="p-4 space-y-3 text-sm max-w-md">
          <div className="space-y-1">
            <label className="text-sm">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <Button type="submit" disabled={changing} className="w-full md:w-auto">
            {changing ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </section>
    </div>
  );
}
