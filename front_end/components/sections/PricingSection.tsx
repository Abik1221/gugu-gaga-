"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { TrialDialog } from "@/components/ui/trial-dialog";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";

export default function PricingSection() {
  const [selectedType, setSelectedType] = useState<"owner" | "supplier">(
    "owner"
  );
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const router = useRouter();

  const handleSupplierPlanClick = (planName: string) => {
    setComingSoonOpen(true);
  };

  const handlePlanClick = (plan: any) => {
    if (selectedType === "supplier") {
      handleSupplierPlanClick(plan.name);
    } else if (plan.name === "Free Trial") {
      // Free trial buttons will use TrialDialog
      return;
    }
    // Other owner plan buttons can have their own logic here
  };

  const ownerPlans = [
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
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Essential",
      price: "1,299",
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
        "Mobile app access",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Professional",
      price: "2,499",
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
        "Dedicated account manager",
      ],
      cta: "Go Professional",
      highlight: true,
    },
  ];

  const supplierPlans = [
    {
      name: "Free Trial",
      price: "0",
      period: "30 Days",
      description: "Test all supplier features",
      popular: false,
      features: [
        "All Growth features included",
        "Product catalog management",
        "Order processing",
        "Customer communication",
        "Advanced analytics",
        "Priority marketplace listing",
        "24/7 support",
      ],
      cta: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Starter",
      price: "799",
      period: "Birr/month",
      description: "Perfect for small suppliers",
      popular: false,
      features: [
        "Product catalog management",
        "Basic order processing",
        "Customer communication",
        "Payment tracking",
        "Monthly reports",
        "Email support",
      ],
      cta: "Start Supplying",
      highlight: false,
    },
    {
      name: "Growth",
      price: "1,299",
      period: "Birr/month",
      description: "For expanding supplier businesses",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Bulk order management",
        "Inventory forecasting",
        "Priority marketplace listing",
        "24/7 phone support",
        "Custom branding",
      ],
      cta: "Scale Your Business",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "For large-scale suppliers",
      popular: false,
      features: [
        "Everything in Growth",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label solutions",
        "SLA guarantees",
        "On-site training",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  const currentPlans = selectedType === "owner" ? ownerPlans : supplierPlans;

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            Simple,{" "}
            <span className="text-emerald-600">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your business. Start with a 30-day free
            trial, then select the tier that matches your needs.
          </p>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md border">
              <Button
                variant={selectedType === "owner" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-md transition-all ${selectedType === "owner"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
                onClick={() => setSelectedType("owner")}
              >
                Bussiness Owner
              </Button>
              <Button
                variant={selectedType === "supplier" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-md transition-all ${selectedType === "supplier"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
                onClick={() => setSelectedType("supplier")}
              >
                Supplier
              </Button>
            </div>
          </div>
        </motion.div>

        <div
          className={`grid gap-14 max-w-6xl mx-auto ${selectedType === "supplier" ? "md:grid-cols-4" : "md:grid-cols-3"
            }`}
        >
          {currentPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`p-4 relative ${index === 2 ? "text-[14px]" : ""} ${plan.highlight
                  ? "border-2 border-emerald-500 shadow-2xl md:scale-105"
                  : "border border-gray-200"
                  }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-2xl text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl text-gray-900">{plan.price}</span>
                  </div>
                  <div className="text-gray-600">{plan.period}</div>
                </div>

                <ul
                  className={`text-[13px] ${index === 2 ? "space-y-1" : "space-y-2"
                    } mb-4`}
                >
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Free Trial" ? (
                  <TrialDialog>
                    <Button
                      className={`w-full ${plan.highlight
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-900 hover:bg-gray-800"
                        }`}
                      size="default"
                    >
                      {plan.cta}
                    </Button>
                  </TrialDialog>
                ) : (
                  <Button
                    className={`w-full ${plan.highlight
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    size="default"
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include secure data encryption, regular backups, and
            Ethiopian Birr support.
            <br />
            {selectedType === "owner"
              ? "Need a custom enterprise solution?"
              : "Ready to join our supplier network?"}{" "}
            <a href="/contact" className="text-emerald-600 underline">
              Contact us
            </a>
          </p>
        </div>
      </div>

      <ComingSoonDialog
        open={comingSoonOpen}
        onOpenChange={setComingSoonOpen}
        title="Supplier Pricing Coming Soon"
        description="Our supplier pricing plans are currently being finalized. This feature will allow suppliers to choose the perfect plan for their business needs. Stay tuned for updates!"
      />
    </section>
  );
}
