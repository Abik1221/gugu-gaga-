import SolutionImage from "@/public/ai_solution.jpg";
import Image from "next/image";
import { motion } from "framer-motion";
export default function Solutions() {
  return (
    <section
      id="ai-solutions"
      className="flex flex-col justify-center max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-10 my-20">
        <motion.div
          className="my-10 block"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image src={SolutionImage} alt="ai-powered-solutions-image" />
        </motion.div>
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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
