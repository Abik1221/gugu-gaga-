// Marketing-specific layout (header with nav, footer)
import Link from "next/link";
import { ArrowLeft, Linkedin, Twitter, Mail } from "lucide-react";
import Footer from "@/components/sections/Footer";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#ai-solutions", label: "Solutions" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-emerald-50 text-gray-900">
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
