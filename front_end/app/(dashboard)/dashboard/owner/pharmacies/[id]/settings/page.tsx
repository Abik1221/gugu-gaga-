"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { PharmaciesAPI } from "@/utils/api";

export default function PharmacySettingsPage() {
  const { show } = useToast();
  const params = useParams();
  const id = Number(params?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      try {
        const p = await PharmaciesAPI.get(id);
        setName(p.name || "");
        setAddress(p.address || "");
        setError(null);
      } catch (e:any) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSave() {
    setSaving(true);
    try {
      await PharmaciesAPI.update(id, { name: name || undefined, address: address || undefined });
      show({ variant: "success", title: "Saved", description: name });
    } catch (e:any) {
      show({ variant: "destructive", title: "Save failed", description: e.message });
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Pharmacy Settings</h1>
      {loading ? (<Skeleton className="h-64" />) : error ? (<div className="text-sm text-red-600">{error}</div>) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Address</label>
            <Input value={address} onChange={(e)=>setAddress(e.target.value)} />
          </div>
          <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      )}
    </div>
  );
}
