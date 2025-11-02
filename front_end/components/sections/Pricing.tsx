import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import planIcon from "@/public/plan.png";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
const FreePlanCard = () => {
  return (
    <Card className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-25px_rgba(255,255,255,0.45)]">
      <CardHeader>
        <div className="mb-4 w-fit rounded-md bg-white/10 p-3">
          <Image src={planIcon} alt="plan-icon" className="h-8 w-8 object-contain invert brightness-150" />
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-200">
          Starter Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-200">
          <p className="text-lg font-semibold">
            Enjoy a 30-day free trial while you validate your first AI workflows.
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">FREE</p>
        </div>
        <div className="text-center mt-4">
          <Button className="w-full rounded border border-white/20 bg-white/10 px-4 py-2 font-bold text-white transition hover:border-emerald-400 hover:bg-white/20">
            Get Started
          </Button>
        </div>
        <p className="pt-10 mb-5 font-bold text-emerald-200">Features</p>
        <ul className="list-none space-y-2 text-gray-200">
          <li>
            <span className="pr-5">✔</span>30-day guided free trial with upgrade prompts
          </li>
          <li>
            <span className="pr-5">✔</span>3 AI assistant questions per day (safe read-only insights)
          </li>
          <li>
            <span className="pr-5">✔</span>Connect one Google Sheets workbook for data import
          </li>
          <li>
            <span className="pr-5">✔</span>Preview pro dashboards with "Upgrade to unlock" guidance
          </li>
          <li>
            <span className="pr-5">✔</span>Single-business workspace with secure token storage
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const ProPlanCard = () => {
  return (
    <Card className="mx-auto max-w-md rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-blue-600/10 p-6 text-white shadow-[0_25px_80px_-35px_rgba(255,255,255,0.55)]">
      <CardHeader>
        <div className="mb-4 w-fit rounded-md bg-white/10 p-3">
          <Image src={planIcon} alt="plan-icon" className="h-8 w-8 object-contain invert brightness-150" />
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-100">
          Pro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-100">
          <p className="text-lg font-semibold">
            Great for growing teams that need more agents and integrations
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-200">2700 Br</p>
        </div>
        <div className="text-center mt-4">
          <Button className="w-full rounded bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-2 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-600 hover:to-blue-700">
            Get Started
          </Button>
        </div>
        <p className="pt-10 mb-5 font-bold text-emerald-100">Features</p>
        <ul className="list-none space-y-2 text-gray-100">
          <li>
            <span className="pr-5">✔</span>Full access to every premium feature
          </li>
          <li>
            <span className="pr-5">✔</span>20 AI assistant questions per user per day
          </li>
          <li>
            <span className="pr-5">✔</span>
            Unlimited integrations (Zoho Books, Odoo, Notion, Google Sheets)
          </li>
          <li>
            <span className="pr-5">✔</span>Multi-location management with admin segments & alerts
          </li>
          <li>
            <span className="pr-5">✔</span>Priority support & compliance-ready audit history
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
function Pricing() {
  return (
    <div className="mx-auto mt-20 mb-40 max-w-6xl" id="pricing">
      <h3 className="mb-6 text-center text-3xl font-bold text-emerald-200">
        Flexible pricing, only for you
      </h3>

      <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-gray-200">
        Select the perfect plan for your needs and maximize productivity.
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="my-10 flex flex-row flex-wrap justify-center gap-10 md:justify-between"
      >
        <FreePlanCard />
        <ProPlanCard />
      </motion.div>
    </div>
  );
}

export default Pricing;
