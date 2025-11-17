"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecureAdminAccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin login
    router.replace('/superadin/zemnpharma/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
}