"use client"
import { motion } from "framer-motion"; // Import Framer Motion
import righttop from "@/public/threeimg.jpeg";
import messobconnector from '@/public/messobconnector.jpeg';
import ownerOverview from "@/public/owner-overview.jpg";
import overview from '@/public/overview.jpeg'
import Image from "next/image";
// Variants for the container to stagger child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Stagger child animations by 0.3s
    },
  },
};

// Variants for the title
const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Variants for each step card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Variants for the numbered circle
const circleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="mx-auto flex max-w-5xl flex-col justify-center py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Animated Title */}
      <motion.h3
        className="mb-20 text-center text-2xl font-bold text-black"
        variants={titleVariants}
      >
        How Mesob Works
      </motion.h3>
      <div className="grid gap-8 md:grid-cols-2 mb-10 py-5 px-2 shadow-[0_25px_80px_-35px_rgba(255,255,255,0.45)]">
        <div className="overflow-hidden rounded-lg">
          <Image
            className="h-full w-full object-contain"
            src={overview}
            alt="Dashboard-image"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex-1 overflow-hidden rounded-lg">
            <Image
              className="h-full w-full object-fill"
              src={righttop}
              alt="AI-assistant-image"
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-lg">
            <Image
              className="h-full w-full object-cover"
              src={messobconnector}
              alt="Owner-overview-image"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-3 mt-40 text-black">
        {/* Step 1 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black "
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">1</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-black">
            Setup & Integration
          </h4>
          <p className="text-gray-700">
            Quick setup with your existing inventory data. Integrate with your
            suppliers and payment systems seamlessly.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">2</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-black">
            AI Optimization
          </h4>
          <p className="text-gray-700">
            Our AI analyzes your operations and starts providing insights,
            predictions, and automated recommendations.
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">3</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-black">
            Grow & Scale
          </h4>
          <p className="text-gray-700">
            Expand your business with confidence using real-time data,
            multi-branch support, and continuous AI improvements.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
