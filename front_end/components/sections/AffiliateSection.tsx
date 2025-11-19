"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link2, DollarSign, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import personImg from "@/public/personImg.jpeg";
import Link from "next/link";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";
export default function AffiliateSection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Generous Commissions",
      description:
        "Receive competitive commissions for every successful referral, whether it's a supplier or inventory owner.",
    },
    {
      icon: Link2,
      title: "Simple Link Sharing",
      description:
        "Generate your unique referral link instantly and share it anywhere—social media, email, or your website.",
    },
    {
      icon: Users,
      title: "Dual Revenue Streams",
      description:
        "Earn from both supplier referrals and inventory owner sign-ups. Double your earning potential.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Tracking",
      description:
        "Monitor your referrals, conversions, and earnings in real-time through your dedicated affiliate dashboard.",
    },
  ];

  return (
    <section
      id="affiliate"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4">
            Turn Your Network into{" "}
            <span className="text-emerald-700">Revenue</span>
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Join our affiliate program and earn money by connecting suppliers
            with inventory owners. No inventory, no upfront costs—just share and
            earn.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Sign Up for Free</h4>
                    <p className="text-emerald-800">
                      Create your affiliate account in minutes. No application
                      process.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Generate Your Link</h4>
                    <p className="text-emerald-800">
                      Get your unique referral link with one click from your
                      dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Share & Promote</h4>
                    <p className="text-emerald-800">
                      Share your link with suppliers and business owners in your
                      network.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-900 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Earn Commissions</h4>
                    <p className="text-emerald-800">
                      Get paid for every successful subscription through your
                      referral link.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ComingSoonDialog>
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 w-full"
              >
                Become an Affiliate Partner
              </Button>
            </ComingSoonDialog>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src={personImg}
              alt="Affiliate Dashboard"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full">
                  <Icon className="w-10 h-10 text-emerald-300 mb-4" />
                  <h3 className="text-xl mb-2">{benefit.title}</h3>
                  <p className="text-emerald-800">{benefit.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
