"use client";
import React, { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // console.error(error);
  }, [error]);

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-lg font-semibold">POS failed to load</h2>
      <p className="text-sm text-gray-600 break-all">{error.message}</p>
      <button onClick={reset} className="border rounded px-3 py-2 text-sm hover:bg-gray-50">Try again</button>
    </div>
  );
}
