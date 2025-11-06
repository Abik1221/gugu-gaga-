"use client"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AISection() {
  const capabilities = [
    {
      icon: Brain,
      title: "Intelligent Forecasting",
      description: "Predict demand patterns and optimize stock levels using advanced machine learning algorithms trained on your historical data."
    },
    {
      icon: AlertTriangle,
      title: "Proactive Alerts",
      description: "Get notified before you run out of stock, identify slow-moving items, and detect unusual patterns that need attention."
    },
    {
      icon: TrendingUp,
      title: "Sales Insights",
      description: "Understand what's selling, when, and why. Get actionable recommendations to maximize revenue and minimize waste."
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Receive AI-powered suggestions on reorder quantities, pricing strategies, and product placement optimization."
    },
    {
      icon: Target,
      title: "Performance Analytics",
      description: "Track KPIs, identify trends, and make data-driven decisions with comprehensive analytics powered by AI."
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "Automatically detect suspicious activities, inventory discrepancies, and potential theft with AI monitoring."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400 mb-4">
            Powered by Advanced AI
          </Badge>
          <h2 className="text-4xl mb-4">
            Meet <span className="text-emerald-400">Mesob AI Assistant</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your 24/7 AI inventory assistant that learns from your business,
            predicts trends, and provides professional insights to help you stay ahead.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1597121798359-e9ee76aa0478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHNoZWx2ZXN8ZW58MXx8fHwxNzYyMjYwODA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="AI-Powered Pharmacy Management"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 italic mb-2">"How is my pharmacy inventory performing this month?"</p>
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
                    <p className="text-sm text-emerald-100">
                      Your pharmacy has seen a 23% increase in sales compared to last month.
                      However, I notice you're running low on antibiotics. Based on current trends,
                      I recommend ordering 150 units of Amoxicillin within the next 3 days to avoid stockouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 italic mb-2">"Which products are underperforming?"</p>
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
                    <p className="text-sm text-emerald-100">
                      I've identified 12 slow-moving items worth 45,000 Birr that haven't sold in 60 days.
                      I suggest running a promotion or adjusting your ordering strategy for these items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-colors h-full">
                  <Icon className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-xl text-white mb-2">{capability.title}</h3>
                  <p className="text-gray-300">{capability.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
