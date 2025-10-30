import { motion } from "framer-motion"; // Import Framer Motion

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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Variants for each step card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Variants for the numbered circle
const circleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
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
        className="mb-10 text-center text-2xl font-bold text-emerald-200"
        variants={titleVariants}
      >
        How Zemen Pharma Works
      </motion.h3>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Step 1 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">1</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-white">
            Setup & Integration
          </h4>
          <p className="text-gray-300">
            Quick setup with your existing pharmacy data. Integrate with your
            suppliers and payment systems seamlessly.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">2</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-white">
            AI Optimization
          </h4>
          <p className="text-gray-300">
            Our AI analyzes your operations and starts providing insights,
            predictions, and automated recommendations.
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-white">3</span>
          </motion.div>
          <h4 className="mb-3 text-xl font-semibold text-white">
            Grow & Scale
          </h4>
          <p className="text-gray-300">
            Expand your business with confidence using real-time data,
            multi-branch support, and continuous AI improvements.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
