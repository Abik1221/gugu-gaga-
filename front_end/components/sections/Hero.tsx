import HeroImage from "@/public/hero.jpg";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
const FEATURE_PILLARS = [
  {
    title: "Integrations",
    description:
      "OAuth-ready connectors for Zoho Books, Odoo, Notion, and Google Sheets with staged sync pipelines.",
  },
  {
    title: "AI Ops",
    description:
      "LangGraph assistant turns tenant data into actionable revenue, inventory, and staffing guidance.",
  },
  {
    title: "Admin Control",
    description:
      "Segment tenants by free trial, payment status, and tool adoption to keep operations humming.",
  },
  {
    title: "Trial → Pro",
    description:
      "Guided upgrade prompts, payment code verification, and compliance-grade audit history built in.",
  },
];

export default function Hero({
  handleScrollToSection,
}: {
  handleScrollToSection: (id: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURE_PILLARS.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const activePillar = useMemo(() => FEATURE_PILLARS[activeIndex], [activeIndex]);
  return (
    <section
      className="relative flex flex-col items-center justify-center h-screen text-center bg-gray-200"
      id="hero"
    >
      <div>
        {/* Background Image */}
        <Image
          src={HeroImage}
          alt="hero-image"
          fill
          className="object-cover z-0"
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gray bg-opacity-50 backdrop-brightness-40"></div>
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">
          Zemen Inventory
        </h1>
        <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
          The integration-first control center for modern inventory teams
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          Connect Zoho Books, Odoo, Notion, and Google Sheets in minutes. Let the
          LangGraph assistant surface real-time sales and inventory insights, while
          admins steer trials, payments, and multi-branch growth from one place.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded"
            onClick={() => handleScrollToSection("features")}
          >
            Get Started
          </Button>

          <motion.div
            key={activePillar.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-left backdrop-blur"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
              {activePillar.title}
            </span>
            <p className="mt-2 text-sm text-emerald-100/80">
              {activePillar.description}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
