"use client"
import { Card } from "@/components/ui/card";
import { ArrowRight, UserPlus, Settings, Rocket, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Sign Up & Start Free Trial",
      description: "Create your account in minutes and get instant access to your dashboard. No credit card required for the 30-day free trial."
    },
    {
      icon: Settings,
      step: "02",
      title: "Set Up Your Inventory",
      description: "Add your products, branches, and staff. Import existing data from spreadsheets or start fresh. Our AI helps you get organized quickly."
    },
    {
      icon: Rocket,
      step: "03",
      title: "Connect & Integrate",
      description: "Link your existing tools with one-click integrations. Connect with suppliers, set up payment methods, and configure your preferences."
    },
    {
      icon: BarChart,
      step: "04",
      title: "Manage & Grow",
      description: "Start managing inventory across all branches, chat with your AI assistant, and watch your business grow with data-driven insights."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            Get Started in <span className="text-emerald-600">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From sign-up to full operation in less than an hour.
            No technical expertise required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent z-0">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />
                  </div>
                )}
                <Card className="p-6 hover:shadow-xl transition-shadow relative z-10 bg-white h-full">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="text-5xl text-emerald-600/20 mb-2">{step.step}</div>
                  <h3 className="text-xl text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
