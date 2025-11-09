"use client";

import { useSearchParams } from "next/navigation";
import AffiliateLoginPage from "../affiliate-signin/page";
import AffiliateRegisterPage from "../register/affiliate/page";

export default function AuthRouterPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "signin";

  if (["affiliate", "register", "signup"].includes(tab)) {
    return <AffiliateRegisterPage />;
  }

  return <AffiliateLoginPage />;
}
