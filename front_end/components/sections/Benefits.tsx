import { motion } from "framer-motion"; // Import Framer Motion
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Variants for the container to stagger child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger child animations by 0.2s
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

// Variants for the cards with dynamic direction
const cardVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -50 : 50, // Slide left for even-indexed cards, right for odd
    y: 50,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Benefits() {
  return (
    <motion.section
      id="benefits"
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
        Why Choose Zemen Inventory?
      </motion.h3>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Increased Efficiency */}
        <motion.div
          custom={0} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="border-l-4 border-l-white bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Increased Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                Automate routine tasks, reduce manual errors, and streamline
                operations across every branch and warehouse.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Better Decision Making */}
        <motion.div
          custom={1} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="border-l-4 border-l-white bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Better Decision Making
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                Make informed decisions with AI-powered insights and real-time
                data about your business performance.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3: Enhanced Customer Experience */}
        <motion.div
          custom={2} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="border-l-4 border-l-white bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Enhanced Customer Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                Provide seamless customer experiences with online ordering,
                smart product search, and delivery tracking.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 4: Cost Savings */}
        <motion.div
          custom={3} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="border-l-4 border-l-white bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                Reduce waste with smart inventory management and optimize
                staffing with sales pattern analysis.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
