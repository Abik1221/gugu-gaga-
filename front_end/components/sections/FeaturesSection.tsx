"use client";
import { Card } from "@/components/ui/card";
import branch1 from "@/public/branch1.jpeg";
import branch2 from "@/public/branch2.jpeg";
import branch3 from "@/public/branch3.jpeg";
import memory from "@/public/memory.png";
import supplierregistration from "@/public/supplierregistration.jpeg";

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
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

export default function FeaturesSection() {
  const { t } = useLanguage();

  // Features using professional Amharic translations
  const features = [
    {
      icon: Building2,
      title: t.features.feature1Title, // "ብልጥ የዕቃ አስተዳደር" / "Smart Inventory Management"
      description: t.features.feature1Desc,
      image: branch1,
    },
    {
      icon: Users,
      title: t.features.feature2Title, // "የሽያጭ እና POS ስርዓት" / "Sales & POS System"
      description: t.features.feature2Desc,
      image: branch2,
    },
    {
      icon: Plug,
      title: t.features.feature3Title, // "የገንዘብ አስተዳደር" / "Financial Management"
      description: t.features.feature3Desc,
      image: branch3,
    },
    {
      icon: Target,
      title: t.features.feature4Title, // "የሰራተኛ አስተዳደር" / "Employee Management"
      description: t.features.feature4Desc,
      image: memory,
    },
    {
      icon: ShoppingBag,
      title: t.features.feature5Title, // "የደንበኛ ግንዛቤ" / "Customer Insights"
      description: t.features.feature5Desc,
      image: supplierregistration,
    },
  ];

  // Quick features with Amharic translations
  const quickFeatures = [
    { icon: BarChart3, text: t.features.quickFeature1 },
    { icon: Zap, text: t.features.quickFeature2 },
    { icon: GitBranch, text: t.features.quickFeature3 },
    { icon: TrendingUp, text: t.features.quickFeature4 },
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
            {t.features.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.features.subtitle}
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
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:flex-row-reverse" : ""
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
                    width={600}
                    height={400}
                    alt={`${feature.title} - Mesob feature illustration`}
                    placeholder="blur"
                    priority={index === 0}
                    className="rounded-2xl shadow-xl w-full h-auto"
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
