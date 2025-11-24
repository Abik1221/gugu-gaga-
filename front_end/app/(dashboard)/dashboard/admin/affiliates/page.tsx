"use client";
import React, { useEffect, useState } from "react";
import { AdminAPI } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AdminAffiliatesPage() {
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [usage, setUsage] = useState<Array<{ day: string; tokens: number }>>([]);

  async function refresh(page = 1) {
    setLoading(true);
    try {
      const data = await AdminAPI.affiliates(page, 20, q);
      setItems(data.items || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load affiliates");
      show({ variant: "destructive", title: "Error", description: e.message || "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(1); }, []);

  useEffect(() => {
    (async () => {
      try { const u = await AdminAPI.usage(14); setUsage(Array.isArray(u) ? u : []); } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
                  <p className="text-gray-600 text-sm mt-1">Manage affiliate partners and performance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <Input 
                placeholder="Search by email" 
                value={q} 
                onChange={(e)=>setQ(e.target.value)}
                className="w-48 text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md"
              />
              <Button 
                onClick={()=>refresh(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {usage.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📊</span>
                <div className="font-semibold text-gray-900">AI Usage (Last 14 days)</div>
              </div>
              <div className="text-xs text-gray-500">tokens</div>
            </div>
            <div className="flex items-end gap-1 h-20 bg-gray-50 p-3 rounded-lg">
              {usage.map((d) => {
                const max = Math.max(...usage.map(x => x.tokens || 0)) || 1;
                const h = Math.max(2, Math.round((d.tokens / max) * 60));
                return (
                  <div key={d.day} className="flex flex-col items-center" title={`${d.day}: ${d.tokens} tokens`}>
                    <div 
                      className="bg-blue-500 w-3 rounded-t" 
                      style={{ height: `${h}px` }} 
                    />
                    <div className="text-xs text-gray-500 mt-1">{d.day.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600"></div>
              <div className="text-gray-600">Loading affiliates...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="text-red-600 font-medium">Error Loading Data</div>
              <div className="text-red-500 text-center text-sm">{error}</div>
              <Button onClick={()=>refresh(1)} className="bg-red-600 hover:bg-red-700 text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Bank Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Referrals
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Payouts
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((r, index) => (
                    <tr key={r.user_id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{r.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {r.full_name || <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm text-gray-900">
                            {r.bank_name || <span className="text-gray-400">-</span>}
                          </div>
                          {(r.bank_account_name || r.bank_account_number) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {r.bank_account_name && <div>{r.bank_account_name}</div>}
                              {r.bank_account_number && <div>{r.bank_account_number}</div>}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {r.referrals || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-gray-600">Pending: ${r.payouts?.pending_total?.toFixed?.(2) || '0.00'}</div>
                          <div className="text-gray-600">Paid: ${r.payouts?.paid_total?.toFixed?.(2) || '0.00'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => { 
                              try { 
                                await AdminAPI.approveAffiliate(r.user_id); 
                                show({ variant: "success", title: "Approved", description: r.email }); 
                                refresh(); 
                              } catch (e: any) { 
                                show({ variant: "destructive", title: "Failed", description: e.message }); 
                              } 
                            }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            onClick={async () => { 
                              try { 
                                await AdminAPI.rejectAffiliate(r.user_id); 
                                show({ variant: "success", title: "Rejected", description: r.email }); 
                                refresh(); 
                              } catch (e: any) { 
                                show({ variant: "destructive", title: "Failed", description: e.message }); 
                              } 
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td className="px-4 py-12 text-center" colSpan={6}>
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                          </div>
                          <div>
                            <div className="text-lg font-medium text-gray-700">No affiliates found</div>
                            <div className="text-gray-500 text-sm">Try adjusting your search</div>
                          </div>
                          <Button onClick={()=>refresh(1)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Refresh
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {items.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium text-blue-600">{items.length}</span> affiliates
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: {total}
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