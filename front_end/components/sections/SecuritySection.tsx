"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Database,
  CheckCircle2,
  Globe,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "GDPR Compliant",
      description:
        "Full compliance with General Data Protection Regulation (GDPR) ensuring your data privacy rights are protected at every level.",
    },
    {
      icon: Database,
      title: "Tenant Isolation",
      description:
        "Complete data separation between customers using advanced multi-tenancy architecture. Your data stays yours, always isolated and secure.",
    },
    {
      icon: Award,
      title: "Regular Security Audits",
      description:
        "Quarterly third-party security audits and penetration testing to ensure continuous protection against emerging threats.",
    },
    {
      icon: Globe,
      title: "Data Sovereignty",
      description:
        "Your data is hosted in secure facilities with full backup and disaster recovery. You maintain complete ownership and control.",
    },
  ];

  const certifications = [
    "GDPR Compliant",
    "ISO 27001",
    "SOC 2 Type II",
    "PCI DSS",
    "OWASP Certified",
  ];

  return (
    <section
      id="security"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Enterprise-Grade Security
          </Badge>
          <h2 className="text-4xl text-gray-900 mb-4">
            <span className="text-emerald-600">Built by Ethiopia</span> for
            Africa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            World-class security standards combined with local expertise. We
            understand the African market and built a platform that meets
            international compliance while serving local needs.
          </p>
        </motion.div>

        <div className="space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {securityFeatures.slice(0, 2).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-shadow h-full border-2 border-gray-200 hover:border-emerald-300">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {securityFeatures.slice(2, 4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index + 2}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-shadow h-full border-2 border-gray-200 hover:border-emerald-300">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl mb-4">Your Data, Your Control</h3>
              <p className="text-emerald-100 mb-6">
                We believe in complete transparency and data ownership. Your business data belongs to you, and you have full control over how it's stored, accessed, and managed. We never share or sell your information.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-white">End-to-end encryption for all data</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-white">Automatic daily backups</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-white">24/7 security monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-white">Secure cloud infrastructure</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-emerald-900" />
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Built by Ethiopians</h4>
                    <p className="text-emerald-100 text-sm">
                      Developed by Ethiopian engineers who understand the unique
                      challenges of African businesses.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">Made for Africa</h4>
                    <p className="text-blue-100 text-sm">
                      Tailored to meet the specific needs of African markets
                      with local support and infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Questions about our security?{" "}
            <a href="#contact" className="text-emerald-600 underline">
              Contact our security team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
