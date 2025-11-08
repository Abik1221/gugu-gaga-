"use client";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProblemSolution() {
  const problems = [
    "Manual stock tracking leading to errors and losses",
    "No visibility across multiple store branches",
    "Disconnected systems and spreadsheets",
    "Difficulty connecting with reliable suppliers",
    "No real-time insights into inventory health",
    "Wasted time on administrative tasks",
  ];

  const solutions = [
    "AI-powered automated inventory tracking and alerts",
    "Centralized dashboard for all branches in one place",
    "One-click integrations with Google Sheets, ERP, and more",
    "Direct supplier marketplace in your dashboard",
    "Real-time AI chat assistant for instant insights",
    "Automated workflows saving hours every week",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            From Chaos to <span className="text-emerald-600">Control</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional Bussiness management is holding Ethiopian businesses
            back. It's time for a revolution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 border-2 border-red-200 bg-red-50/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl text-gray-900">Old Way Problems</h3>
              </div>
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-700 text-sm">✕</span>
                    </div>
                    <span className="text-gray-700">{problem}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 border-2 border-emerald-200 bg-emerald-50/50 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl text-gray-900">Mesob Way</h3>
              </div>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="text-gray-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
