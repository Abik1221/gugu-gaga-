"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { TrialDialog } from "@/components/ui/trial-dialog";
import { useLanguage } from "@/contexts/language-context";

export default function CTASection() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl mb-6"
        >
          {t.cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto"
        >
          {t.cta.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <TrialDialog>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
            >
              {t.cta.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </TrialDialog>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => router.push('/contact')}
          >
            {t.hero.cta2}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center gap-3">
            <Shield className="w-10 h-10 text-emerald-400" />
            <div className="text-lg">{t.cta.feature1Title}</div>
            <p className="text-sm text-gray-900">
              {t.cta.feature1Desc}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-10 h-10 text-emerald-400" />
            <div className="text-lg">{t.cta.feature2Title}</div>
            <p className="text-sm text-gray-900">
              {t.cta.feature2Desc}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <HeadphonesIcon className="w-10 h-10 text-emerald-400" />
            <div className="text-lg">{t.cta.feature3Title}</div>
            <p className="text-sm text-gray-900">
              {t.cta.feature3Desc}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
