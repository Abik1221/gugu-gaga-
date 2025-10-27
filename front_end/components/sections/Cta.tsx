import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section
      id="cta"
      className="h-screen flex flex-col justify-center text-center max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2, // slower animation
          ease: "easeOut", // smooth easing
        }}
      >
        <h3 className="text-2xl font-bold text-emerald-700 mb-4">
          Ready to Transform Your Pharmacy?
        </h3>
        <p className="text-lg text-gray-700 mb-8">
          Join the future of pharmacy management with Zemen Pharma's AI-powered
          platform. Schedule a demo to see how we can help your business grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          >
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <Link href="/register?tab=affiliate">Affiliate</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
