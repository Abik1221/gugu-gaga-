import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Owner Registration | MesobAI",
  description:
    "Register your business with MesobAI - The leading AI-powered business management system in Ethiopia.",
};

export default function OwnerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
