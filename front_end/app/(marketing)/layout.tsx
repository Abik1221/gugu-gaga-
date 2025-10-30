// Marketing-specific layout (header with nav, footer)
import Link from "next/link";
import { Brain, Linkedin, Twitter, Mail } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-emerald-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="group inline-flex items-center gap-2 font-semibold text-white">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 shadow-[0_18px_45px_-25px_rgba(16,185,129,0.8)] transition group-hover:scale-105">
              <Brain className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-wide">Zemen Pharma</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-emerald-100 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-emerald-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/auth"
              className="rounded-full border border-white/15 px-4 py-2 text-emerald-100 transition hover:border-emerald-300/60 hover:text-emerald-200"
            >
              Login
            </Link>
            <Link
              href="/register/pharmacy"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-600 hover:to-sky-600"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:py-16">{children}</div>
      </main>

      <footer className="mt-16 border-t border-white/10 bg-white/5">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-12 md:grid-cols-5">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 shadow-[0_18px_45px_-25px_rgba(16,185,129,0.8)]">
                <Brain className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold">Zemen Pharma</span>
            </Link>
            <p className="text-sm text-emerald-100/70">
              Multi-tenant, AI-powered management for modern pharmacies. Insightful dashboards, secure workflows, and delightful patient experiences.
            </p>
            <div className="flex gap-3 text-emerald-100/70">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@zemenpharma.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-emerald-300/40 hover:text-emerald-200"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid gap-8 text-sm text-emerald-100/70 md:col-span-3 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features" className="transition hover:text-emerald-200">Feature overview</Link></li>
                <li><Link href="/#ai-solutions" className="transition hover:text-emerald-200">AI solutions</Link></li>
                <li><Link href="/#pricing" className="transition hover:text-emerald-200">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/#about" className="transition hover:text-emerald-200">About</Link></li>
                <li><Link href="/contact" className="transition hover:text-emerald-200">Contact</Link></li>
                <li><Link href="/register?tab=affiliate" className="transition hover:text-emerald-200">Affiliates</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="transition hover:text-emerald-200">Privacy policy</Link></li>
                <li><Link href="/terms" className="transition hover:text-emerald-200">Terms of service</Link></li>
                <li><Link href="/auth?tab=signin" className="transition hover:text-emerald-200">Customer login</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-emerald-100/60 md:flex-row md:items-center md:justify-between">
            <p>© {year} Zemen Pharma. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition hover:text-emerald-200">Privacy</Link>
              <Link href="/terms" className="transition hover:text-emerald-200">Terms</Link>
              <Link href="/contact" className="transition hover:text-emerald-200">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
