import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import securityIcon from "@/public/shield.png";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

// Variants for the container (parent) to stagger child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger child animations by 0.2s
    },
  },
};

// Variants for the image
const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
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

// Variants for the card sections (left slides from left, right from right)
const cardVariants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -50 : 50,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Variants for list items (p tags) in CardContent
const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function SecurityFeatures() {
  return (
    <section className="bg-emerald-50 py-12 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Card className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 relative">
          {/* Animated Image */}
          <motion.div
            className="absolute -top-12 md:left-1/5 left-4/5 transform -translate-x-1/2"
            variants={imageVariants}
          >
            <Image
              src={securityIcon}
              alt="Security Icon"
              className="w-50 h-50 object-contain"
            />
          </motion.div>

          {/* Animated Title */}
          <motion.div
            className="text-2xl font-bold text-emerald-700 mb-12 text-center mt-10"
            variants={titleVariants}
          >
            Safe & Secure
          </motion.div>

          {/* Animated Card Content */}
          <div className="grid md:grid-cols-2 gap-10 flex-col lg:flex-row items-center mt-16">
            <motion.div
              className="border-b pb-10 md:border-0 md:border-r border-emerald-200 md:pr-6"
              custom="left" // Pass direction for slide animation
              variants={cardVariants}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-emerald-900">
                  Your data stays secure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ml-6 mt-4">
                {[
                  "Encryption",
                  "Tenant Isolation",
                  "Secure Credentials",
                  "Audit logs for compliance",
                ].map((item, index) => (
                  <motion.p key={index} variants={listItemVariants}>
                    {item}
                  </motion.p>
                ))}
              </CardContent>
            </motion.div>
            <motion.div
              custom="right" // Pass direction for slide animation
              variants={cardVariants}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-emerald-900">
                  You control every decision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ml-6 mt-4">
                {[
                  "Approval for large purchases",
                  "Set spending limits & alerts",
                  "Complete visibility",
                  "One click rollback",
                ].map((item, index) => (
                  <motion.p key={index} variants={listItemVariants}>
                    {item}
                  </motion.p>
                ))}
              </CardContent>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

export default SecurityFeatures;
