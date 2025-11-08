"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import connectImg from "@/public/connect.jpeg";
import { motion } from "framer-motion";
import Image from "next/image";

export default function IntegrationsSection() {
  const integrations = [
    {
      name: "Google Sheets",
      category: "Spreadsheets",
      logo: "https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png",
      description:
        "Export reports and sync inventory data directly from Google Sheets for easy analysis and sharing.",
    },
    {
      name: "SAP",
      category: "ERP",
      logo: "https://www.sap.com/dam/application/shared/logos/sap-logo-svg.svg",
      description:
        "Seamlessly integrate with SAP ERP systems for enterprise-level financial and operational management.",
    },
    {
      name: "Odoo",
      category: "ERP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Odoo_logo.svg/200px-Odoo_logo.svg.png",
      description:
        "Connect with Odoo's comprehensive business suite for unified inventory, sales, and accounting workflows.",
    },
  ];

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            Connect with{" "}
            <span className="text-emerald-600">Your Favorite Tools</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One-click integrations with business tools. No coding required.
            Seamlessly sync your data across all platforms.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={connectImg}
              alt="Integration Network"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl text-gray-900">Effortless Integration</h3>
            <p className="text-lg text-gray-600">
              Stop juggling multiple platforms. Mesob AI connects seamlessly
              with your existing tools, creating a unified ecosystem for your
              business operations.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">
                  One-click setup for all integrations
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">
                  Real-time data synchronization
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">
                  Secure, encrypted connections
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">
                  No technical knowledge required
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                {category}
              </Badge>
              <div className="flex flex-wrap justify-center gap-6">
                {integrations
                  .filter((int) => int.category === category)
                  .map((integration, intIndex) => (
                    <motion.div
                      key={intIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: intIndex * 0.05 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full w-80">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                          <img
                            src={integration.logo}
                            alt={`${integration.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <h4 className="text-gray-900 font-semibold mb-2 text-center">
                          {integration.name}
                        </h4>
                        <p className="text-gray-600 text-sm text-center">
                          {integration.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Don't see your tool?{" "}
            <a href="/request-integration" className="text-emerald-600 underline">
              Request a custom integration
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
