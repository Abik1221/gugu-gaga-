"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface Sale {
  id: number;
  branch: string;
  cashier_user_id: number;
  total_amount: number;
  created_at: string;
  lines: Array<{
    medicine_id: number;
    medicine_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
}

export default function StaffSales() {
  const { show } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadSales = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockSales: Sale[] = [
        {
          id: 1,
          branch: "Main",
          cashier_user_id: 1,
          total_amount: 45.50,
          created_at: new Date().toISOString(),
          lines: [
            {
              medicine_id: 1,
              medicine_name: "Paracetamol 500mg",
              sku: "PARA500",
              quantity: 2,
              unit_price: 2.50,
              line_total: 5.00
            },
            {
              medicine_id: 2,
              medicine_name: "Ibuprofen 200mg",
              sku: "IBU200",
              quantity: 1,
              unit_price: 40.50,
              line_total: 40.50
            }
          ]
        }
      ];
      
      setSales(mockSales);
      setTotal(mockSales.length);
    } catch (err: any) {
      show({
        variant: "destructive",
        title: "Failed to load sales",
        description: err?.message || "Unable to fetch sales data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [page, searchQuery, fromDate, toDate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sales History</h2>
        <p className="text-gray-600">View and search transaction records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Medicine
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine name or SKU"
              className="text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="text-black"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={loadSales} variant="outline">
            Apply Filters
          </Button>
          <Button 
            onClick={() => {
              setSearchQuery("");
              setFromDate("");
              setToDate("");
            }}
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No sales found</p>
          </div>
        ) : (
          sales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sale #{sale.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(sale.created_at)} • Branch: {sale.branch || "Main"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(sale.total_amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sale.lines.length} item{sale.lines.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Sale Items */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Items:</h4>
                <div className="space-y-2">
                  {sale.lines.map((line, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{line.medicine_name}</p>
                        <p className="text-sm text-gray-600">SKU: {line.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {line.quantity} × {formatCurrency(line.unit_price)} = {formatCurrency(line.line_total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-6 flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={sales.length < 20}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}