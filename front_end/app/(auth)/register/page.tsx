"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const tab = params.get("tab");
    if (tab) {
      params.delete("tab");
    }
    const query = params.toString();
    if (tab === "affiliate") {
      router.replace(`/register/affiliate${query ? `?${query}` : ""}`);
    } else {
      router.replace(`/register/pharmacy${query ? `?${query}` : ""}`);
    }
  }, [router, searchParams]);

  return null;
}
