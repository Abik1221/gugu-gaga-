import stepImg from "@/public/steps.jpg"
import Image from "next/image";
import { motion } from "framer-motion";
export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-30 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
        How Zemen Pharma Works
      </h3>
      <motion.div
        className="flex h-60 sm:h-100 aspect-square mb-10"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image src={stepImg} alt="steps-image" />
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">1</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            Setup & Integration
          </h4>
          <p className="text-gray-700">
            Quick setup with your existing pharmacy data. Integrate with your
            suppliers and payment systems seamlessly.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">2</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            AI Optimization
          </h4>
          <p className="text-gray-700">
            Our AI analyzes your operations and starts providing insights,
            predictions, and automated recommendations.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
        >
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">3</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            Grow & Scale
          </h4>
          <p className="text-gray-700">
            Expand your business with confidence using real-time data,
            multi-branch support, and continuous AI improvements.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
