"use client"
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  HeadphonesIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl mb-6"
        >
          Ready to Transform Your{" "}
          <span className="text-emerald-400">
            Inventory Management?
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          Join the inventory management revolution. Start your
          30-day free trial today— no credit card required, no
          commitment, just results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-white text-white hover:bg-white/10"
          >
            Schedule a Demo
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
            <div className="text-lg">GDPR Compliant</div>
            <p className="text-sm text-gray-400">
              Enterprise-grade security with complete tenant
              isolation
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-10 h-10 text-emerald-400" />
            <div className="text-lg">Quick Setup</div>
            <p className="text-sm text-gray-400">
              Get started in under an hour with guided
              onboarding
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <HeadphonesIcon className="w-10 h-10 text-emerald-400" />
            <div className="text-lg">24/7 Support</div>
            <p className="text-sm text-gray-400">
              AI and human support always available to help
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}