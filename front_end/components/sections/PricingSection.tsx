"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingSection() {
  const plans = [
    {
      name: "Free Trial",
      price: "0",
      period: "30 Days",
      description: "Perfect for testing all features",
      popular: false,
      features: [
        "All Premium features included",
        "Multi-branch management",
        "AI Stock Sentinel access",
        "All integrations unlocked",
        "Supplier marketplace",
        "Full analytics dashboard",
        "Priority support"
      ],
      cta: "Start Free Trial",
      highlight: false
    },
    {
      name: "Essential",
      price: "2,500",
      period: "Birr/month",
      description: "For single-branch businesses",
      popular: false,
      features: [
        "Single branch management",
        "AI Stock Sentinel chat",
        "Basic integrations",
        "Stock tracking & alerts",
        "Sales analytics",
        "Staff management (up to 5 users)",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Professional",
      price: "5,666",
      period: "Birr/month",
      description: "For growing multi-branch businesses",
      popular: true,
      features: [
        "Unlimited branches",
        "Advanced AI insights & forecasting",
        "All integrations (Google Sheets, ERP, etc.)",
        "Supplier marketplace access",
        "Affiliate program participation",
        "Priority AI support 24/7",
        "Unlimited staff accounts",
        "Advanced analytics & reports",
        "Custom integrations",
        "Dedicated account manager"
      ],
      cta: "Go Professional",
      highlight: true
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            Simple, <span className="text-emerald-600">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business. Start with a 30-day free trial,
            then select the tier that matches your needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`p-8 relative h-full ${plan.highlight
                  ? 'border-2 border-emerald-500 shadow-2xl md:scale-105'
                  : 'border border-gray-200'
                  }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-5xl text-gray-900">{plan.price}</span>
                  </div>
                  <div className="text-gray-600">{plan.period}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.highlight
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include secure data encryption, regular backups, and Ethiopian Birr support.
            <br />
            Need a custom enterprise solution? <a href="#contact" className="text-emerald-600 underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
}
