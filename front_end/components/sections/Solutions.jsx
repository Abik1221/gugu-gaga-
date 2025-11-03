import { motion } from "framer-motion"; // Import Framer Motion
import SolutionImage from "@/public/ai_solution.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

export default function Solutions() {
  // Animation variants for the image (slide in from left)
  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animation variants for the text (slide in from right)
  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  return (
    <section
      id="ai-solutions"
      className="mx-auto flex max-w-5xl flex-col justify-center py-16"
    >
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        {/* Animated Image */}
        <motion.div
          className="block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariants}
        >
          <Image src={SolutionImage} alt="ai-powered-solutions-image" />
        </motion.div>

        {/* Animated Text Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
        >
          <h3 className="mb-6 text-center text-2xl font-bold text-emerald-200">
            AI-Powered Inventory Solutions
          </h3>
          <div className="text-base leading-relaxed text-white">
            Zemen Inventory is an AI-powered operations platform designed to
            streamline stock control, enhance efficiency, and provide real-time
            insights for owners, staff, and partners across every location.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
