"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import branch4 from "@/public/branch4.jpeg";
import { TrialDialog } from "@/components/ui/trial-dialog";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="pt-19 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Bussiness Revolution with AI
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                🇪🇹 Built by Ethiopia for Africa
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl text-gray-900">
                Transform Your{" "}
                <span className="text-emerald-600">Business</span> with AI-Powered Management Software
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <TrialDialog>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
                >
                  Start 30-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </TrialDialog>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => router.push("/contact")}
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <div className="text-3xl text-gray-900">30 Days</div>
                <div className="text-sm text-gray-600">Free Trial</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl text-gray-900">{">"}99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-3xl opacity-20" />
            <Image
              src={branch4}
              alt="AI Dashboard"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
