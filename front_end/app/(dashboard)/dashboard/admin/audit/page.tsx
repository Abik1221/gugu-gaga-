"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString(undefined, { 
      dateStyle: "short", 
      timeStyle: "medium" 
    });
  } catch (e) {
    return value;
  }
}

function ActionBadge({ action }: { action: string }) {
  const getStyle = (action: string) => {
    if (action.includes('create') || action.includes('register')) 
      return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
    if (action.includes('delete') || action.includes('reject')) 
      return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200";
    if (action.includes('update') || action.includes('approve')) 
      return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200";
    if (action.includes('verify') || action.includes('payment')) 
      return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200";
    return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
  };

  const getIcon = (action: string) => {
    if (action.includes('create') || action.includes('register')) return "✨";
    if (action.includes('delete') || action.includes('reject')) return "🗑️";
    if (action.includes('update') || action.includes('approve')) return "✅";
    if (action.includes('verify') || action.includes('payment')) return "💳";
    return "⚡";
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap ${getStyle(action)}`} title={action}>
      <span className="text-xs">{getIcon(action)}</span>
      <span>{action}</span>
    </span>
  );
}

export default function AdminAuditPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [action, setAction] = useState("");
  const [limit, setLimit] = useState("50");

  async function refresh() {
    setLoading(true);
    try {
      const lim = Math.max(1, Math.min(200, Number(limit) || 50));
      const rows = await (AdminAPI.audit || AdminAPI.getAuditLogs || (() => []))({ tenant_id: tenantId || undefined, action: action || undefined, limit: lim });
      setItems(rows || []);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load audit");
      show({ variant: "destructive", title: "Error", description: e.message });
    } finally { 
      setLoading(false); 
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    Audit Trail
                  </h1>
                  <p className="text-gray-600 text-sm">Track all system activities and changes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
              <Input 
                placeholder="🏢 Tenant" 
                value={tenantId} 
                onChange={(e)=>setTenantId(e.target.value)}
                className="w-32 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
              />
              <Input 
                placeholder="⚡ Action" 
                value={action} 
                onChange={(e)=>setAction(e.target.value)}
                className="w-28 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
              />
              <Input 
                placeholder="📊 Limit" 
                value={limit} 
                onChange={(e)=>setLimit(e.target.value)} 
                className="w-20 text-sm text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
              />
              <Button 
                onClick={refresh} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-sm"
              >
                🔍 Filter
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
              </div>
              <div className="text-gray-600 font-medium">Loading audit data...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <div className="text-red-600 font-semibold text-lg">Error Loading Data</div>
              <div className="text-red-500 text-center">{error}</div>
              <Button onClick={refresh} className="bg-red-600 hover:bg-red-700 text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full table-fixed">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-100">
                  <tr>
                    <th className="w-20 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">#</span>
                        ID
                      </div>
                    </th>
                    <th className="w-40 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">🕒</span>
                        Time
                      </div>
                    </th>
                    <th className="w-32 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">🏢</span>
                        Tenant
                      </div>
                    </th>
                    <th className="w-24 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600">👤</span>
                        Actor
                      </div>
                    </th>
                    <th className="w-40 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-600">⚡</span>
                        Action
                      </div>
                    </th>
                    <th className="w-32 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-red-600">🎯</span>
                        Target
                      </div>
                    </th>
                    <th className="w-28 px-2 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                      <div className="flex items-center gap-1">
                        <span className="text-indigo-600">📄</span>
                        Details
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((r, index) => (
                    <tr key={r.id} className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-2 py-4">
                        <span className="font-mono text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-2 py-1 rounded font-semibold">
                          {r.id}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="text-xs text-gray-900 font-medium whitespace-nowrap">
                          {formatDateTime(r.created_at)}
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        {r.tenant_id ? (
                          <span className="font-mono text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded font-semibold break-all" title={r.tenant_id}>
                            {r.tenant_id}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">-</span>
                        )}
                      </td>
                      <td className="px-2 py-4">
                        {r.actor_user_id ? (
                          <span className="font-mono text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-2 py-1 rounded font-semibold">
                            #{r.actor_user_id}
                          </span>
                        ) : (
                          <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs font-medium">System</span>
                        )}
                      </td>
                      <td className="px-2 py-4">
                        <ActionBadge action={r.action} />
                      </td>
                      <td className="px-2 py-4">
                        {r.target_type ? (
                          <div className="space-y-1">
                            <div className="text-gray-700 font-medium text-xs">{r.target_type}</div>
                            {r.target_id && (
                              <div className="font-mono text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold inline-block">
                                #{r.target_id}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">-</span>
                        )}
                      </td>
                      <td className="px-2 py-4 relative">
                        {r.metadata && Object.keys(r.metadata).length > 0 ? (
                          <details className="cursor-pointer group">
                            <summary className="text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors duration-200 inline-block list-none">
                              📄 View
                            </summary>
                            <div className="absolute z-20 right-0 mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-xl max-w-md">
                              <pre className="text-xs text-gray-700 overflow-auto max-h-60 whitespace-pre-wrap">
                                {JSON.stringify(r.metadata, null, 2)}
                              </pre>
                            </div>
                          </details>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No data</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td className="px-6 py-20 text-center" colSpan={7}>
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📋</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xl font-bold text-gray-700">No audit events found</div>
                            <div className="text-gray-500">Try adjusting your filters or check back later</div>
                          </div>
                          <Button onClick={refresh} className="bg-blue-600 hover:bg-blue-700 text-white">
                            🔄 Refresh
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {items.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">
                    📊 Showing <span className="font-bold text-blue-600">{items.length}</span> events
                  </div>
                  <div className="text-xs text-gray-500">
                    Limited to {limit} results
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}