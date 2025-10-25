import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import planIcon from "@/public/plan.png";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const FreePlanCard = () => {
  return (
    <div className="max-w-md mx-auto h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        className="transform-gpu h-full"
      >
        <Card className="w-full h-full bg-white shadow-lg rounded-lg p-6 border border-gray-300 flex flex-col">
          <CardHeader>
            <div className="bg-emerald-100 w-fit p-3 rounded-md mb-4">
              <Image src={planIcon} alt="plan-icon" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              Starter Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 mb-4">
              <p className="text-lg font-semibold">
                Perfect for testing your first AI agent.
              </p>
              <p className="text-3xl font-bold text-emerald-700 mt-2">FREE</p>
            </div>
            <div className="text-center mt-4">
              <Button className="w-full bg-transparent border border-emerald-500 text-emerald-500 font-bold px-4 py-2 rounded hover:bg-emerald-500 hover:text-white">
                Get Started
              </Button>
            </div>
            <p className="pt-10 mb-5 font-bold">Features</p>
            <ul className="list-none space-y-2 text-gray-600">
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
      </motion.div>
    </div>
  );
};

const ProPlanCard = () => {
  return (
    <div className="max-w-md mx-auto h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
        whileHover={{ scale: 1.03 }}
        className="transform-gpu h-full"
      >
        <Card className="w-full h-full bg-white shadow-lg rounded-lg p-6 border border-emerald-300 flex flex-col">
          <CardHeader>
            <div className="bg-emerald-100 w-fit p-3 rounded-md mb-4">
              <Image src={planIcon} alt="plan-icon" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              Pro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 mb-4">
              <p className="text-lg font-semibold">
                Great for growing teams that need more agents and integrations
              </p>
              <p className="text-3xl font-bold text-emerald-700 mt-2">2700 Br</p>
            </div>
            <div className="text-center mt-4">
              <Button className="w-full bg-transparent border bg-emerald-500  text-white font-bold px-4 py-2 rounded hover:bg-emerald-600 hover:text-white">
                Get Started
              </Button>
            </div>
            <p className="pt-10 mb-5 font-bold">Features</p>
            <ul className="list-none space-y-2 text-gray-600">
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
      </motion.div>
    </div>
  );
};

function Pricing() {
  return (
    <div className="mt-20 mb-40" id="pricing">
      <motion.h3
        className="text-3xl font-bold text-emerald-700 mb-12 text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        Flexible pricing, only for you
      </motion.h3>

      <motion.p
        className="text-center text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
      >
        Select the perfect plan for your needs and maximize productivity.
      </motion.p>
      <div className="lg:h-screen flex gap-10 flex-row flex-wrap items-stretch max-w-5xl mx-auto my-10">
        <FreePlanCard />
        <ProPlanCard />
      </div>
    </div>
  );
}

export default Pricing;
