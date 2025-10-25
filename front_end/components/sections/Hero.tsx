import HeroImage from "@/public/hero.jpg";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Hero({
  handleScrollToSection,
}: {
  handleScrollToSection: (id: string) => void;
}) {
  return (
    <section
      className="relative flex flex-col items-center justify-center h-screen text-center bg-gray-200"
      id="hero"
    >
      <div>
        {/* Background Image */}
        <Image
          src={HeroImage}
          alt="hero-image"
          fill
          className="object-cover z-0"
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gray bg-opacity-50 backdrop-brightness-40"></div>
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl font-extrabold text-emerald-700 mb-4">
          Zemen Pharma
        </h1>
        <h2 className="text-2xl font-semibold text-emerald-900 mb-6">
          End-to-End AI-Powered Pharmacy Management
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          Multi-tenant CMS and management system for pharmacies. AI-powered
          insights, real-time dashboards, and seamless medicine search for
          owners, staff, and customers.
        </p>
        <Button
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded"
          onClick={() => handleScrollToSection("features")}
        >
          Get Started
        </Button>
      </motion.div>
    </section>
  );
}
