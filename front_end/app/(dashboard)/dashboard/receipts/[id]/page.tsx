// Receipt view page
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE, getAccessToken } from "@/utils/api";

export default function ReceiptPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        const res = await fetch(`${API_BASE}/api/v1/receipts/${encodeURIComponent(id)}/content`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load receipt (${res.status})`);
        }
        const content = await res.text();
        if (!active) return;
        setHtml(content);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Failed to load receipt");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      active = false;
    };
  }, [id]);

  if (!id) return <div className="p-6 text-sm text-gray-600">Missing receipt id</div>;
  if (loading) return <div className="p-6 text-sm text-gray-600">Loading receipt...</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto bg-white border rounded">
        <div className="p-4" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
