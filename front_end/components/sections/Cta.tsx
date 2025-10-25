import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <section
      id="cta"
      className="h-screen flex flex-col justify-center text-center max-w-2xl mx-auto"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h3
          className="text-2xl font-bold text-emerald-700 mb-4"
          variants={itemVariants}
        >
          Ready to Transform Your Pharmacy?
        </motion.h3>
        <motion.p className="text-lg text-gray-700 mb-8" variants={itemVariants}>
          Join the future of pharmacy management with Zemen Pharma's AI-powered
          platform. Schedule a demo to see how we can help your business grow.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
              onClick={() => (window.location.hash = "#contact")}
            >
              <Link href='/register'>Get Started</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Link href='/affiliate'>Affiliate</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
