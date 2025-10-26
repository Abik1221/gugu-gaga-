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
      className="md:h-screen py-30 flex flex-col justify-center max-w-4xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Animated Title */}
      <motion.h3
        className="text-2xl font-bold text-emerald-700 mb-12 text-center"
        variants={titleVariants}
      >
        How Zemen Pharma Works
      </motion.h3>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-emerald-700">1</span>
          </motion.div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            Setup & Integration
          </h4>
          <p className="text-gray-700">
            Quick setup with your existing pharmacy data. Integrate with your
            suppliers and payment systems seamlessly.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div className="text-center" variants={cardVariants}>
          <motion.div
            className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-emerald-700">2</span>
          </motion.div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
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
            className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            variants={circleVariants}
          >
            <span className="text-2xl font-bold text-emerald-700">3</span>
          </motion.div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
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
