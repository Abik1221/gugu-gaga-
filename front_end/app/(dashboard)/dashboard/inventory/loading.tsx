"use client";
import React from "react";
import { TableSkeletonRows } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Inventory Management</div>
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">SKU</th>
              <th className="text-left px-3 py-2">Category</th>
              <th className="text-right px-3 py-2">Stock</th>
              <th className="text-right px-3 py-2">Sale Price</th>
              <th className="text-right px-3 py-2">Cost</th>
              <th className="text-left px-3 py-2">Expiry</th>
            </tr>
          </thead>
          <TableSkeletonRows rows={8} cols={7} />
        </table>
      </div>
    </div>
  );
}
