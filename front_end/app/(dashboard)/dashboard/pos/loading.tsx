"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 md:col-span-7">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-semibold">Point of Sale</div>
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="border rounded bg-white overflow-hidden">
          <div className="max-h-[520px] overflow-auto divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="col-span-12 md:col-span-5">
        <div className="border rounded bg-white">
          <div className="border-b p-3 font-medium">Cart</div>
          <div className="divide-y max-h-[420px] overflow-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><Skeleton className="h-4 w-16" /></div>
            <div className="flex justify-between font-semibold"><span>Total</span><Skeleton className="h-4 w-16" /></div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </aside>
    </div>
  );
}
