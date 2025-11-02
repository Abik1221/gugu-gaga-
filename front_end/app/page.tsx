"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BarChart3, Brain, CreditCard, Search } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import HowItWorks from "@/components/sections/HowItWorks";
import SecurityFeatures from "@/components/sections/SecurityFeatures";
import Pricing from "@/components/sections/Pricing";
import Solutions from "@/components/sections/Solutions";
import Benefits from "@/components/sections/Benefits";
import CTA from "@/components/sections/Cta";
import WhoIsZemenPharma from "@/components/sections/WhoIsZemenPharma";
import Footer from "@/components/sections/Footer";
type FeatureHighlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const heroFeatures: FeatureHighlight[] = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations for inventory management, demand forecasting, and business optimization.",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboards",
    description:
      "Monitor your locations with live analytics, sales tracking, and branch management tools.",
  },
  {
    icon: Search,
    title: "Smart Product Search",
    description:
      "Advanced search capabilities for staff and customers to find products quickly and efficiently.",
  },
  {
    icon: CreditCard,
    title: "Complete POS System",
    description:
      "Support for cash, card, and digital payments with automatic receipts and end-of-day reporting.",
  },
];

function LandingHero({
  onScrollToFeatures,
}: {
  onScrollToFeatures: () => void;
}) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-24 text-white lg:pt-34 p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-3xl lg:text-[2.5rem]">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              End-to-End AI-Powered
            </span>
            <br />
            <span className="text-white">Inventory Management</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-md lg:mx-0">
            Multi-tenant CMS and management system for inventory-led businesses.
            AI-powered insights, real-time dashboards, and seamless product
            search for owners, staff, and customers.
          </p>
          <div className="flex flex-col items-center gap-4 sm:-mt-2 sm:flex-row sm:justify-center lg:mt-4 lg:justify-start">
            <Link
              href="/register/pharmacy"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-2 text-md font-semibold text-white shadow-[0_25px_70px_-20px_rgba(16,185,129,0.65)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_35px_90px_-25px_rgba(16,185,129,0.7)]"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <button
              type="button"
              onClick={onScrollToFeatures}
              className="inline-flex cursor-pointer items-center rounded-xl border-2 border-white/20 px-8 py-2 text-md font-semibold text-white shadow-[0_25px_70px_-25px_rgba(59,130,246,0.55)] transition-all duration-300 hover:translate-y-[-2px] hover:border-emerald-400 hover:text-emerald-400 hover:shadow-[0_35px_90px_-30px_rgba(59,130,246,0.6)]"
            >
              Explore Features
            </button>
            <Link
              href="/register?tab=affiliate"
              className="inline-flex items-center rounded-xl border-2 border-white/20 px-8 py-2 text-md font-semibold text-white shadow-[0_25px_70px_-25px_rgba(147,51,234,0.55)] transition-all duration-300 hover:translate-y-[-2px] hover:border-emerald-400 hover:text-emerald-400 hover:shadow-[0_35px_90px_-30px_rgba(147,51,234,0.6)]"
            >
              Become an Affiliate
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <Image
              src="/hero.jpg"
              alt="Secure Cloud-Based Inventory Management System"
              width={720}
              height={540}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      <div className="absolute left-10 top-32 opacity-30">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 blur-xl"
        />
      </div>
      <div className="absolute bottom-32 right-10 opacity-30">
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl"
        />
      </div>
    </section>
  );
}

function FeatureHighlights() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-black to-gray-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything You Need to Run Your Inventory Operations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Comprehensive tools designed specifically for modern inventory
            operations.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {heroFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/60 hover:bg-white/10 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 opacity-0 blur group-hover:opacity-20" />
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative bg-black text-white">
      <NavBar
        isOpen={isOpen}
        scrolled={scrolled}
        setIsOpen={setIsOpen}
        setScrolled={setScrolled}
        handleScrollToSection={handleScrollToSection}
      />
      <LandingHero
        onScrollToFeatures={() => handleScrollToSection("features")}
      />
      <FeatureHighlights />
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-16 text-white">
        <WhoIsZemenPharma />
        <Solutions />
        <SecurityFeatures />
        <HowItWorks />
        <Benefits />
        <Pricing />
        <CTA />
      </div>
      <Footer />
    </div>
  );
}
