import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="lg:h-screen flex flex-col justify-center max-w-5xl mx-auto"
    >
      <motion.h3
        className="text-2xl font-bold text-emerald-700 mb-12 text-center"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Why Choose Zemen Pharma?
      </motion.h3>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
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

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
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

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
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

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.28 }}
        >
          <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-900">
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Reduce waste with smart inventory management and optimize staffing
              with sales pattern analysis.
            </p>
          </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
