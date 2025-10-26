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
      className="flex flex-col justify-center max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-10 my-20">
        {/* Animated Image */}
        <motion.div
          className="my-10 block"
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
          <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center mt-20">
            AI-Powered Solutions
          </h3>
          <div className="text-gray-700">
            Zemen Pharma is an AI-powered pharmacy management system designed to
            streamline operations, enhance efficiency, and provide real-time
            insights for pharmacy owners, staff, and customers.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
