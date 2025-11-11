"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AffiliateLoginPage from "../affiliate-signin/page";
import AffiliateRegisterPage from "../register/affiliate/page";
import { SimpleLoading } from "@/components/ui/simple-loading";

function AuthContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "signin";

  if (["affiliate", "register", "signup"].includes(tab)) {
    return <AffiliateRegisterPage />;
  }

  return <AffiliateLoginPage />;
}

export default function AuthRouterPage() {
  return (
    <Suspense fallback={<SimpleLoading />}>
      <AuthContent />
    </Suspense>
  );
}
