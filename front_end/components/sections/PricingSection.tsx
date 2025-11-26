"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export default function PricingSection() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<"owner" | "supplier">(
    "owner"
  );
  const router = useRouter();


  const handlePlanClick = (plan: any) => {
    // Redirect to the appropriate registration page based on selected type
    router.push(selectedType === "owner" ? "/register/owner" : "/register/supplier");
  };

  // Owner plans with context-aware Amharic translations
  const ownerPlans = t.pricing ? [
    {
      name: "Free Trial",
      nameAm: "ነጻ ሙከራ",
      price: "0",
      priceAm: "0",
      period: "30 Days",
      periodAm: "30 ቀናት",
      description: "Perfect for testing all features",
      descriptionAm: "ሁሉንም ባህሪያት ለመሞከር ፍጹም",
      popular: false,
      features: [
        { en: "All Premium features included", am: "ሁሉም የፕሪሚየም ባህሪያት ተካተዋል" },
        { en: "Multi-branch management", am: "ባለብዙ-ቅርንጫፍ አስተዳደር" },
        { en: "AI Stock Sentinel access", am: "AI የእቃ ጠባቂ መዳረሻ" },
        { en: "All integrations unlocked", am: "ሁሉም ግንኙነቶች ተከፍተዋል" },
        { en: "Supplier marketplace", am: "የአቅራቢዎች ገበያ" },
        { en: "Full analytics dashboard", am: "ሙሉ የትንታኔ ዳሽቦርድ" },
        { en: "Priority support", am: "ቅድሚያ ያለው ድጋፍ" },
      ],
      cta: "Start Free Trial",
      ctaAm: "ነጻ ሙከራ ጀምር",
      highlight: false,
    },
    {
      name: "Essential",
      nameAm: "ኤሴንሻል",
      price: "1,299",
      priceAm: "1,299",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      description: "For single-branch businesses",
      descriptionAm: "ለአንድ-ቅርንጫፍ ንግዶች",
      popular: false,
      features: [
        { en: "Single branch management", am: "የአንድ ቅርንጫፍ አስተዳደር" },
        { en: "AI Stock Sentinel chat", am: "AI የእቃ ጠባቂ ውይይት" },
        { en: "Basic integrations", am: "መሰረታዊ ግንኙነቶች" },
        { en: "Stock tracking & alerts", am: "የእቃ ክትትል እና ማንቂያዎች" },
        { en: "Sales analytics", am: "የሽያጭ ትንታኔ" },
        { en: "Staff management (up to 5 users)", am: "የሰራተኞች አስተዳደር (እስከ 5 ተጠቃሚዎች)" },
        { en: "Email support", am: "የኢሜይል ድጋፍ" },
        { en: "Mobile app access", am: "የሞባይል መተግበሪያ መዳረሻ" },
      ],
      cta: "Get Started",
      ctaAm: "ይጀምሩ",
      highlight: false,
    },
    {
      name: "Professional",
      nameAm: "ፕሮፌሽናል",
      price: "2,499",
      priceAm: "2,499",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      description: "For growing multi-branch businesses",
      descriptionAm: "ለበዙ ለማደግ ባለብዙ-ቅርንጫፍ ንግዶች",
      popular: true,
      features: [
        { en: "Unlimited branches", am: "ያልተገደቡ ቅርንጫፎች" },
        { en: "Advanced AI insights & forecasting", am: "የላቁ AI ግንዛቤዎች እና ትንበያ" },
        { en: "All integrations (Google Sheets, ERP, etc.)", am: "ሁሉም ግንኙነቶች (Google Sheets፣ ERP፣ ወዘተ)" },
        { en: "Supplier marketplace access", am: "የአቅራቢዎች ገበያ መዳረሻ" },
        { en: "Affiliate program participation", am: "የአጋር መርሃ ግብር ተሳትፎ" },
        { en: "Priority AI support 24/7", am: "ቅድሚያ ያለው AI ድጋፍ 24/7" },
        { en: "Unlimited staff accounts", am: "ያልተገደቡ የሰራተኛ መለያዎች" },
        { en: "Advanced analytics & reports", am: "የላቁ ትንታኔዎች እና ሪፖርቶች" },
        { en: "Custom integrations", am: "ብጁ ግንኙነቶች" },
        { en: "Dedicated account manager", am: "ልዩ መለያ አስተዳዳሪ" },
      ],
      cta: "Go Professional",
      ctaAm: "ፕሮፌሽናል ይሁኑ",
      highlight: true,
    },
  ] : [];

  const supplierPlans = [
    {
      name: "Free Trial",
      nameAm: "ነጻ ሙከራ",
      price: "0",
      priceAm: "0",
      period: "30 Days",
      periodAm: "30 ቀናት",
      description: "Test all supplier features",
      descriptionAm: "ሁሉንም የአቅራቢ ባህሪያት ይሞክሩ",
      popular: false,
      features: [
        { en: "All Growth features included", am: "ሁሉም የእድገት ባህሪያት ተካተዋል" },
        { en: "Product catalog management", am: "የምርት ካታሎግ አስተዳደር" },
        { en: "Order processing", am: "የትዕዛዝ ሂደት" },
        { en: "Customer communication", am: "የደንበኛ ግንኙነት" },
        { en: "Advanced analytics", am: "የላቁ ትንታኔዎች" },
        { en: "Priority marketplace listing", am: "ቅድሚያ ያለው የገበያ ዝርዝር" },
        { en: "24/7 support", am: "24/7 ድጋፍ" },
      ],
      cta: "Start Free Trial",
      ctaAm: "ነጻ ሙከራ ጀምር",
      highlight: false,
    },
    {
      name: "Starter",
      nameAm: "መጀመሪያ",
      price: "799",
      priceAm: "799",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      description: "Perfect for small suppliers",
      descriptionAm: "ለትናንሽ አቅራቢዎች ፍጹም",
      popular: false,
      features: [
        { en: "Product catalog management", am: "የምርት ካታሎግ አስተዳደር" },
        { en: "Basic order processing", am: "መሰረታዊ የትዕዛዝ ሂደት" },
        { en: "Customer communication", am: "የደንበኛ ግንኙነት" },
        { en: "Payment tracking", am: "የክፍያ ክትትል" },
        { en: "Monthly reports", am: "ወርሃዊ ሪፖርቶች" },
        { en: "Email support", am: "የኢሜይል ድጋፍ" },
      ],
      cta: "Start Supplying",
      ctaAm: "አቅርቦት ጀምር",
      highlight: false,
    },
    {
      name: "Growth",
      nameAm: "እድገት",
      price: "1,299",
      priceAm: "1,299",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      description: "For expanding supplier businesses",
      descriptionAm: "ለማደግ ላሉ የአቅራቢ ንግዶች",
      popular: true,
      features: [
        { en: "Everything in Starter", am: "በመጀመሪያ ውስጥ ያለው ሁሉ" },
        { en: "Advanced analytics", am: "የላቁ ትንታኔዎች" },
        { en: "Bulk order management", am: "የጅምላ ትዕዛዝ አስተዳደር" },
        { en: "Inventory forecasting", am: "የእቃ ትንበያ" },
        { en: "Priority marketplace listing", am: "ቅድሚያ ያለው የገበያ ዝርዝር" },
        { en: "24/7 phone support", am: "24/7 የስልክ ድጋፍ" },
        { en: "Custom branding", am: "ብጁ የምርት ስም" },
      ],
      cta: "Scale Your Business",
      ctaAm: "ንግድዎን ያሳድጉ",
      highlight: true,
    },
    {
      name: "Enterprise",
      nameAm: "ድርጅታዊ",
      price: "Custom",
      priceAm: "ብጁ",
      period: "Contact us",
      periodAm: "ያነጋግሩን",
      description: "For large-scale suppliers",
      descriptionAm: "ለትላልቅ አቅራቢዎች",
      popular: false,
      features: [
        { en: "Everything in Growth", am: "በእድገት ውስጥ ያለው ሁሉ" },
        { en: "API access", am: "API መዳረሻ" },
        { en: "Custom integrations", am: "ብጁ ግንኙነቶች" },
        { en: "Dedicated account manager", am: "ልዩ መለያ አስተዳዳሪ" },
        { en: "White-label solutions", am: "ነጭ-መለያ መፍትሄዎች" },
        { en: "SLA guarantees", am: "SLA ዋስትናዎች" },
        { en: "On-site training", am: "በቦታ ላይ ስልጠና" },
      ],
      cta: "Contact Sales",
      ctaAm: "ሽያጮችን ያነጋግሩ",
      highlight: false,
    },
  ];

  const currentPlans = selectedType === "owner" ? ownerPlans : supplierPlans;

  // Get the current language
  const isAmharic = t.nav.features === "ባህሪያት";

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
            {t.pricing.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t.pricing.subtitle}
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
                    {t.pricing.mostPopular}
                  </Badge>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-2xl text-gray-900 mb-2">
                    {isAmharic ? plan.nameAm || plan.name : plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isAmharic ? plan.descriptionAm || plan.description : plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl text-gray-900">
                      {isAmharic && plan.priceAm ? plan.priceAm : plan.price}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {isAmharic ? plan.periodAm || plan.period : plan.period}
                  </div>
                </div>

                <ul
                  className={`text-[13px] ${index === 2 ? "space-y-1" : "space-y-2"
                    } mb-4`}
                >
                  {plan.features.map((feature: any, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {typeof feature === 'string'
                          ? feature
                          : (isAmharic ? feature.am : feature.en)}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Free Trial" ? (
                  <Button
                    className={`w-full ${plan.highlight
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    size="default"
                    onClick={() => router.push(selectedType === "owner" ? "/register/owner" : "/register/supplier")}
                  >
                    {isAmharic ? plan.ctaAm || plan.cta : plan.cta}
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${plan.highlight
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    size="default"
                    onClick={() => handlePlanClick(plan)}
                  >
                    {isAmharic ? plan.ctaAm || plan.cta : plan.cta}
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
    </section>
  );
}
