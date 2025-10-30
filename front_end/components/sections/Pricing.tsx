import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import planIcon from "@/public/plan.png";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
const FreePlanCard = () => {
  return (
    <Card className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-25px_rgba(16,185,129,0.45)]">
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
            <span className="pr-5">✔</span>30-day free trial — cancel anytime
          </li>
          <li>
            <span className="pr-5">✔</span>Up to 10 AI assistant messages included
          </li>
          <li>
            <span className="pr-5">✔</span>2 agents available to configure
          </li>
          <li>
            <span className="pr-5">✔</span>Ultimate pharmacy dashboard access
          </li>
          <li>
            <span className="pr-5">✔</span>Secure tenant-ready data storage
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const ProPlanCard = () => {
  return (
    <Card className="mx-auto max-w-md rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-blue-600/10 p-6 text-white shadow-[0_25px_80px_-35px_rgba(59,130,246,0.55)]">
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
            <span className="pr-5">✔</span>Access to all features
          </li>
          <li>
            <span className="pr-5">✔</span>Unlimited user accounts
          </li>
          <li>
            <span className="pr-5">✔</span>
            Comprehensive reporting tools
          </li>
          <li>
            <span className="pr-5">✔</span>24/7 customer support
          </li>
          <li>
            <span className="pr-5">✔</span>Secure data storage
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
