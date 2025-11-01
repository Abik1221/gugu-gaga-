import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section
      id="cta"
      className="mx-auto flex max-w-3xl flex-col justify-center py-24 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2, // slower animation
          ease: "easeOut", // smooth easing
        }}
        className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur shadow-[0_20px_60px_-25px_rgba(16,185,129,0.45)]"
      >
        <h3 className="mb-4 text-3xl font-bold text-emerald-200">
          Ready to Transform Your Inventory Operations?
        </h3>
        <p className="mb-8 text-lg text-gray-200">
          Join the future of inventory management with Zemen Inventory's AI-powered
          platform. Schedule a demo to see how we can help your business grow.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="cursor-pointer bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/40 transition hover:from-emerald-600 hover:to-blue-700"
          >
            <Link href="/register/pharmacy">Get Started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="cursor-pointer border border-white/20 bg-white/5 text-white transition hover:border-emerald-400 hover:text-emerald-200 hover:bg-white/10"
          >
            <Link href="/auth?tab=affiliate">Affiliate</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
