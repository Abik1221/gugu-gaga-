"use client"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export default function AISection() {
  const { t } = useLanguage();
  const capabilities = [
    {
      icon: Brain,
      title: t.ai.feature1Title, // "ብልህ ትንበያዎች" / "Smart Predictions"
      description: t.ai.feature1Desc
    },
    {
      icon: AlertTriangle,
      title: t.ai.feature2Title, // "ራስ-ሰር ግንዛቤዎች" / "Automated Insights"
      description: t.ai.feature2Desc
    },
    {
      icon: TrendingUp,
      title: t.ai.feature3Title, // "ብልህ ድጋፍ" / "Intelligent Support"
      description: t.ai.feature3Desc
    },
    {
      icon: Lightbulb,
      title: t.ai.feature1Title, // Re-using translation
      description: t.ai.feature1Desc
    },
    {
      icon: Target,
      title: t.ai.feature2Title, // Re-using translation
      description: t.ai.feature2Desc
    },
    {
      icon: Shield,
      title: t.ai.feature3Title, // Re-using translation
      description: t.ai.feature3Desc
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
            {t.ai.badge}
          </Badge>
          <h2 className="text-4xl mb-4">
            {t.ai.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.ai.subtitle}
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
              alt={t.ai.imageAlt}
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 italic mb-2">{t.ai.chat1Question}</p>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      {t.ai.chat1Answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 italic mb-2">{t.ai.chat2Question}</p>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      {t.ai.chat2Answer}
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
                <Card className="bg-white border-gray-200 p-6 hover:bg-gray-50 transition-colors h-full shadow-sm">
                  <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-700">{capability.description}</p>
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
