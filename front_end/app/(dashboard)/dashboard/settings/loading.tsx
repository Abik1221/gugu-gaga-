"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="border rounded bg-white">
        <div className="border-b p-4 font-medium">Profile</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded bg-white">
        <div className="border-b p-4 font-medium">Change Password</div>
        <div className="p-4 space-y-3 text-sm max-w-md">
          <div className="space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </section>
    </div>
  );
}
