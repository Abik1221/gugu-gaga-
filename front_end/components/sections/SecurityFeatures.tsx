import React from "react";
import securityIcon from "@/public/shield.png";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
function SecurityFeatures() {
  return (
    <section className="bg-emerald-50 py-12 px-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 relative">
        {/* Image at the top */}
        <div className="absolute -top-12 md:left-1/5 left-4/5 transform -translate-x-1/2">
          <Image
            src={securityIcon}
            alt="Security Icon"
            className="w-50 h-50 object-contain"
          />
        </div>


        {/* Content Box */}
        <div className="text-2xl font-bold text-emerald-700 mb-12 text-center mt-10">
          Safe & Secure
        </div>
        <div className="grid md:grid-cols-2 gap-10 flex-col lg:flex-row items-center mt-16">
          <motion.div
            className="border-b pb-10 md:border-0 md:border-r border-emerald-200 md:pr-6"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-900">
                Your data stays secure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ml-6 mt-4">
              <p>Encryption</p>
              <p>Tenant Isolation</p>
              <p>Secure Credentials</p>
              <p>Audit logs for compliance</p>
            </CardContent>
          </motion.div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-900">
                You control every decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ml-6 mt-4">
              <p>Approval for large purchases</p>
              <p>Set spending limits & alerts</p>
              <p>Complete visibility</p>
              <p>One click rollback</p>
            </CardContent>
          </motion.div>
        </div>
        </Card>
      </motion.div>
    </section>
  );
}


export default SecurityFeatures;
