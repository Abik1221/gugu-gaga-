"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReferralPageProps {
  params: {
    token: string;
  };
}

export default function ReferralPage({ params }: ReferralPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Store the affiliate token in localStorage for use during registration
    if (params.token) {
      localStorage.setItem("affiliate_token", params.token);
      // Redirect to pharmacy registration with affiliate token
      router.push(`/register/owner?ref=${params.token}`);
    } else {
      // If no token, redirect to home
      router.push("/");
    }
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-700 font-medium">Processing referral link...</p>
      </div>
    </div>
  );
}