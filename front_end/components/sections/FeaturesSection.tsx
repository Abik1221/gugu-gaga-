"use client";
import { Card } from "@/components/ui/card";
import branch1 from "@/public/branch1.jpeg";
import branch2 from "@/public/branch2.jpeg";
import branch3 from "@/public/branch3.jpeg";
import branch4 from "@/public/suppliermarketplace.jpeg";

import {
  Building2,
  Users,
  Plug,
  TrendingUp,
  Share2,
  MessageSquare,
  BarChart3,
  ShoppingBag,
  GitBranch,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      icon: Building2,
      title: "Multi-Branch Management",
      description:
        "Manage all your store locations from a single, unified dashboard. Get real-time visibility into stock levels, sales, and performance across every branch.",
      image: branch1,
    },
    {
      icon: Users,
      title: "Staff & Team Management",
      description:
        "Create staff accounts with custom permissions, track activities, and ensure accountability across your organization with role-based access control.",
      image: branch2,
    },
    {
      icon: Plug,
      title: "One-Click Integrations",
      description:
        "Seamlessly connect with Google Sheets, ERP systems, accounting software, and more. No technical knowledge required—just one click to integrate your existing tools.",
      image: branch3,
    },
    {
      icon: ShoppingBag,
      title: "Supplier Marketplace",
      description:
        "Connect directly with verified suppliers who promote their products on your dashboard. Discover new products, compare prices, and order with confidence.",
      image: branch4,
    },
    // {
    //   icon: Share2,
    //   title: "Affiliate Marketing Program",
    //   description: "Generate your unique referral link and earn commissions by connecting suppliers with inventory owners. Turn your network into a revenue stream.",
    //   image: "https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGNoYXJ0c3xlbnwxfHx8fDE3NjIyODI0MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    // },
    // {
    //   icon: MessageSquare,
    //   title: "AI Chat Assistant",
    //   description: "Chat with Stock Sentinel AI about your inventory anytime. Get instant answers, professional insights, forecasts, and recommendations based on your data.",
    //   image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    // }
  ];

  const quickFeatures = [
    { icon: BarChart3, text: "Real-time Analytics" },
    { icon: Zap, text: "Automated Alerts" },
    { icon: GitBranch, text: "Stock Transfers" },
    { icon: TrendingUp, text: "Sales Forecasting" },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            Everything You Need in{" "}
            <span className="text-emerald-600">One Platform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete, modern inventory management system designed specifically
            for Ethiopian shops, pharmacies, and retail businesses.
          </p>
        </motion.div>

        <div className="space-y-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`space-y-6 ${!isEven ? "lg:order-2" : ""}`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl text-gray-900">{feature.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={!isEven ? "lg:order-1" : ""}
                >
                  <Image
                    src={feature.image}
                    width={10}
                    height={10}
                    alt="super market image"
                    placeholder="empty"
                    className="rounded-2xl shadow-xl w-full"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {quickFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <p className="text-gray-700">{feature.text}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
