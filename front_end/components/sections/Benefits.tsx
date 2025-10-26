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
    transition: { duration: 0.6, ease: "easeOut" },
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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Benefits() {
  return (
    <motion.section
      id="benefits"
      className="lg:h-screen flex flex-col justify-center max-w-5xl mx-auto"
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
        Why Choose Zemen Pharma?
      </motion.h3>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Card 1: Increased Efficiency */}
        <motion.div
          custom={0} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="bg-white border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Increased Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Automate routine tasks, reduce manual errors, and streamline
                operations across all your pharmacy locations.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: Better Decision Making */}
        <motion.div
          custom={1} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="bg-white border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Better Decision Making
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
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
          <Card className="bg-white border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Enhanced Customer Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Provide seamless shopping experiences with online ordering,
                medicine search, and delivery tracking.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 4: Cost Savings */}
        <motion.div
          custom={3} // Pass index for dynamic direction
          variants={cardVariants}
        >
          <Card className="bg-white border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
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
