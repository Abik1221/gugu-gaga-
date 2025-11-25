import Link from "next/link";
import { Brain, Linkedin, Send, Mail } from "lucide-react";

const footerNav = {
  product: [
    { href: "/#features", label: "Feature overview" },
    { href: "/#ai-solutions", label: "AI solutions" },
    { href: "/#pricing", label: "Pricing" },
  ],
  company: [
    { href: "/contact", label: "Contact" },
    { href: "/register?tab=affiliate", label: "Affiliates" },
  ],
  resources: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
  ],
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white bg-black">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-12 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="text-lg font-semibold">Mesob</span>
          </Link>
          <p className="max-w-sm text-sm text-emerald-100">
            Multi-tenant, AI-powered management for modern bussiness. Insightful
            dashboards, secure workflows, and supplier experiences.
          </p>
          <div className="flex gap-3 text-emerald-100">
            <a
              href="https://www.linkedin.com/in/nahom-keneni-638290330/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://t.me/nahom_keneni"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
            >
              <Send className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@zemenpharma.com"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-8 text-sm text-emerald-100 md:col-span-3 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="space-y-2">
              {footerNav.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              {footerNav.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {footerNav.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white bg-black">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-emerald-100/60 md:flex-row md:items-center md:justify-between">
          <p>© {year} Mesob. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-emerald-200">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-emerald-200">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-emerald-200">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
