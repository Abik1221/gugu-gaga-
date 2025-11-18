"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const meterMarks = Array.from({ length: 24 }, (_, idx) => idx);

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-black to-slate-900 px-6 py-20 text-white">
      <div className="pointer-events-none absolute -left-28 top-16 h-[28rem] w-[28rem] rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 grid w-full max-w-4xl gap-10 rounded-3xl border border-white/10 bg-black/55 p-10 shadow-[0_35px_120px_-40px_rgba(16,185,129,0.55)] backdrop-blur-xl lg:grid-cols-[1.1fr_1fr]"
      >
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-100/80">
            404 gauge
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              We can’t locate that route
            </h1>
            <p className="text-sm text-emerald-100/80 sm:text-base">
              The URL you followed isn’t connected to an active workspace or marketing page. Quickly jump back to familiar ground or open a support ticket.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-[0_20px_65px_-35px_rgba(16,185,129,0.75)] hover:from-emerald-500/90 hover:to-blue-500/90"
            >
              <Link href="/">Return home</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border border-emerald-300/30 bg-white/5 text-white hover:border-emerald-200 hover:bg-white/10"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>

          <p className="text-xs text-emerald-100/60">
            Need help tracing a missing page? Email <a href="mailto:support@zemenpharma.com" className="font-semibold text-emerald-200">support@zemenpharma.com</a> or call <a href="tel:+251983446134" className="font-semibold text-emerald-200">+251 983 446 134</a>.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20 p-10 shadow-[0_30px_90px_-45px_rgba(59,130,246,0.6)]"
        >
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-black/60">
            <motion.div
              className="absolute h-52 w-52 rounded-full border border-emerald-400/30"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            />
            <motion.div
              className="absolute h-40 w-40 rounded-full border border-blue-400/20"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
            />

            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-black/80 shadow-inner">
              {meterMarks.map((mark) => (
                <span
                  key={mark}
                  className="absolute h-1.5 w-8 origin-[0%_50%] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-transparent/0"
                  style={{ transform: `rotate(${mark * (360 / meterMarks.length)}deg) translateX(62px)` }}
                />
              ))}
              <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-black/70">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/70">Code</span>
                <span className="mt-1 text-4xl font-bold text-white">404</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.4em] text-emerald-200">Gauge offline</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
