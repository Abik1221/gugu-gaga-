"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UPCOMING_TOOLS = [
  { name: "Google Sheets", description: "Sync sales and stock data directly from spreadsheets." },
  { name: "Notion", description: "Keep SOPs and task lists aligned with your pharmacy ops." },
  { name: "Zoho Books", description: "Automate accounting hand-offs without manual exports." },
  { name: "Odoo / ERP integrations", description: "Bridge enterprise inventory and procurement systems." },
];

export default function OwnerIntegrationsComingSoonPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_32px_120px_-60px_rgba(16,185,129,0.75)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Tool integrations · Coming soon</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/80">
            We&apos;re building rich connections to the tools you already use so you can keep your pharmacy data in one place.
            Stay tuned for Google Sheets, Notion, ERP connectors, and more — arriving soon.
          </p>
        </div>
        <Link href="/dashboard/owner">
          <Button variant="ghost">Back to owner dashboard</Button>
        </Link>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">What&apos;s on the roadmap?</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {UPCOMING_TOOLS.map((tool) => (
            <Card key={tool.name} className="border-white/10 bg-white/10 text-emerald-50 shadow-[0_25px_100px_-60px_rgba(16,185,129,0.6)]">
              <CardHeader>
                <CardTitle className="text-xl text-white">{tool.name}</CardTitle>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Coming soon</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-100/80">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">How it will work</h2>
        <Card className="border-white/10 bg-white/10 text-emerald-50">
          <CardContent className="space-y-3 p-6 text-sm text-emerald-100/80">
            <p>1. Connect securely with OAuth — no credentials stored in plain text.</p>
            <p>2. Choose which data to sync (inventory, sales, tasks, accounting, and more).</p>
            <p>3. Ask the agent questions and get insights that combine your Zemen data with the external tool.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Want early access?</h2>
        <Card className="border-white/10 bg-white/10 text-emerald-50">
          <CardContent className="space-y-4 p-6 text-sm text-emerald-100/80">
            <p>
              We&apos;re piloting integrations with a small group of pharmacies. If you&apos;d like to be part of the beta,
              reach out to your customer success manager — we&apos;ll get you on the list.
            </p>
            <p className="text-xs text-emerald-200/70">Until then, all existing analytics continue to work with in-app data.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
