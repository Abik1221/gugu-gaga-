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
  const { t, language } = useLanguage();
  const router = useRouter();



  const handlePlanClick = (plan: any) => {
    // Redirect to the appropriate registration page based on selected type
    router.push("/register/owner");
  };

  // Helper to get translated text
  const getTranslatedText = (item: any, field: string) => {
    if (language === 'am') return item[`${field}Am`] || item[field];
    if (language === 'or') return item[`${field}Or`] || item[field];
    if (language === 'ti') return item[`${field}Ti`] || item[field];
    return item[field];
  };

  // Owner plans with context-aware Amharic, Afaan Oromo, and Tigrinya translations
  const ownerPlans = t.pricing ? [
    {
      name: "Free Trial",
      nameAm: "ነጻ ሙከራ",
      nameOr: "Yaalii Bilisaa",
      nameTi: "ነጻ ፈተነ",
      price: "0",
      priceAm: "0",
      priceOr: "0",
      priceTi: "0",
      period: "30 Days",
      periodAm: "30 ቀናት",
      periodOr: "Guyyaa 30",
      periodTi: "30 መዓልቲ",
      description: "Perfect for testing all features",
      descriptionAm: "ሁሉንም ባህሪያት ለመሞከር ፍጹም",
      descriptionOr: "Amaloota hunda yaaluuf mijataa",
      descriptionTi: "ኩሉ ባህርያት ንምፍታን ዝምችእ",
      popular: false,
      features: [
        { en: "All Premium features included", am: "ሁሉም የፕሪሚየም ባህሪያት ተካተዋል", or: "Amaloonni Premium hundi hammatamaniiru", ti: "ኩሉ ናይ ፕሪሚየም ባህርያት ሓዊሱ" },
        { en: "Multi-branch management", am: "ባለብዙ-ቅርንጫፍ አስተዳደር", or: "Bulchiinsa damee hedduu", ti: "ብዙሕ ጨንፈር ምሕደራ" },
        { en: "AI Stock Sentinel access", am: "AI የእቃ ጠባቂ መዳረሻ", or: "Argannoo AI Stock Sentinel", ti: "AI ናይ ንብረት ሓላዊ መእተዊ" },

        { en: "Supplier marketplace", am: "የአቅራቢዎች ገበያ", or: "Gabaa dhiyeessitootaa", ti: "ናይ ኣቕረብቲ ዕዳጋ" },
        { en: "Full analytics dashboard", am: "ሙሉ የትንታኔ ዳሽቦርድ", or: "Dashboard xiinxala guutuu", ti: "ምሉእ ናይ ትንተና ዳሽቦርድ" },
        { en: "Priority support", am: "ቅድሚያ ያለው ድጋፍ", or: "Deeggarsa dursa", ti: "ቀዳምነት ዘለዎ ደገፍ" },
      ],
      cta: "Start Free Trial",
      ctaAm: "ነጻ ሙከራ ጀምር",
      ctaOr: "Yaalii Bilisaa Jalqabi",
      ctaTi: "ነጻ ፈተነ ጀምር",
      highlight: false,
    },
    {
      name: "Essential",
      nameAm: "ኤሴንሻል",
      nameOr: "Barbaachisaa",
      nameTi: "መሰረታዊ",
      price: "1,299",
      priceAm: "1,299",
      priceOr: "1,299",
      priceTi: "1,299",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      periodOr: "Birr/ji'a",
      periodTi: "ብር/ወርሒ",
      description: "For single-branch businesses",
      descriptionAm: "ለአንድ-ቅርንጫፍ ንግዶች",
      descriptionOr: "Daldala damee tokkoof",
      descriptionTi: "ንሓደ ጨንፈር ንግድታት",
      popular: false,
      features: [
        { en: "Single branch management", am: "የአንድ ቅርንጫፍ አስተዳደር", or: "Bulchiinsa damee tokkoo", ti: "ናይ ሓደ ጨንፈር ምሕደራ" },
        { en: "AI Stock Sentinel chat", am: "AI የእቃ ጠባቂ ውይይት", or: "Haasaa AI Stock Sentinel", ti: "AI ናይ ንብረት ሓላዊ ዕላል" },

        { en: "Stock tracking & alerts", am: "የእቃ ክትትል እና ማንቂያዎች", or: "Hordoffii stokii & akeekkachiisa", ti: "ናይ ንብረት ምክትታልን መጠንቀቕታን" },
        { en: "Sales analytics", am: "የሽያጭ ትንታኔ", or: "Xiinxala gurgurtaa", ti: "ናይ መሸጣ ትንተና" },
        { en: "Staff management (up to 5 users)", am: "የሰራተኞች አስተዳደር (እስከ 5 ተጠቃሚዎች)", or: "Bulchiinsa hojjetaa (hanga fayyadamtoota 5)", ti: "ናይ ሰራሕተኛ ምሕደራ (ክሳብ 5 ተጠቀምቲ)" },
        { en: "Email support", am: "የኢሜይል ድጋፍ", or: "Deeggarsa imeelii", ti: "ናይ ኢሜይል ደገፍ" },
        { en: "Mobile app access", am: "የሞባይል መተግበሪያ መዳረሻ", or: "Argannoo appii mobaayilaa", ti: "ናይ ሞባይል መተግበሪያ መእተዊ" },
      ],
      cta: "Get Started",
      ctaAm: "ይጀምሩ",
      ctaOr: "Jalqabi",
      ctaTi: "ጀምር",
      highlight: false,
    },
    {
      name: "Professional",
      nameAm: "ፕሮፌሽናል",
      nameOr: "Ogeessa",
      nameTi: "ፕሮፌሽናል",
      price: "2,499",
      priceAm: "2,499",
      priceOr: "2,499",
      priceTi: "2,499",
      period: "Birr/month",
      periodAm: "ብር/ወር",
      periodOr: "Birr/ji'a",
      periodTi: "ብር/ወርሒ",
      description: "For growing multi-branch businesses",
      descriptionAm: "ለበዙ ለማደግ ባለብዙ-ቅርንጫፍ ንግዶች",
      descriptionOr: "Daldala damee hedduu guddachaa jiraniif",
      descriptionTi: "ንዝዓብዩ ዘለዉ ብዙሕ ጨንፈር ንግድታት",
      popular: true,
      features: [
        { en: "Unlimited branches", am: "ያልተገደቡ ቅርንጫፎች", or: "Dameewwan daangaa hin qabne", ti: "ደረት ዘይብሎም ጨናፍር" },
        { en: "Advanced AI insights & forecasting", am: "የላቁ AI ግንዛቤዎች እና ትንበያ", or: "Hubannoo AI olaanaa & tilmaama", ti: "ዝተራቀቐ AI ርድኢትን ትንበያን" },

        { en: "Supplier marketplace access", am: "የአቅራቢዎች ገበያ መዳረሻ", or: "Argannoo gabaa dhiyeessitootaa", ti: "ናይ ኣቕረብቲ ዕዳጋ መእተዊ" },
        { en: "Affiliate program participation", am: "የአጋር መርሃ ግብር ተሳትፎ", or: "Hirmaannaa sagantaa hiriyyaa", ti: "ናይ መሻርኽቲ መደብ ተሳትፎ" },
        { en: "Priority AI support 24/7", am: "ቅድሚያ ያለው AI ድጋፍ 24/7", or: "Deeggarsa AI dursa 24/7", ti: "ቀዳምነት ዘለዎ AI ደገፍ 24/7" },
        { en: "Unlimited staff accounts", am: "ያልተገደቡ የሰራተኛ መለያዎች", or: "Akkaawuntii hojjetaa daangaa hin qabne", ti: "ደረት ዘይብሎም ናይ ሰራሕተኛ ኣካውንታት" },
        { en: "Advanced analytics & reports", am: "የላቁ ትንታኔዎች እና ሪፖርቶች", or: "Xiinxala olaanaa & gabaasa", ti: "ዝተራቀቐ ትንተናን ሪፖርታትን" },

        { en: "Dedicated account manager", am: "ልዩ መለያ አስተዳዳሪ", or: "Hojii gaggeessaa akkaawuntii addaa", ti: "ፍሉይ ናይ ኣካውንት ኣመሓዳሪ" },
      ],
      cta: "Go Professional",
      ctaAm: "ፕሮፌሽናል ይሁኑ",
      ctaOr: "Ogeessa Ta'i",
      ctaTi: "ፕሮፌሽናል ኩን",
      highlight: true,
    },
  ] : [];



  const currentPlans = ownerPlans;


  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" >
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


        </motion.div>

        <div
          className={`grid gap-14 max-w-6xl mx-auto md:grid-cols-3`}
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
                    {getTranslatedText(plan, 'name')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {getTranslatedText(plan, 'description')}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl text-gray-900">
                      {getTranslatedText(plan, 'price')}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {getTranslatedText(plan, 'period')}
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
                          : (language === 'am' ? feature.am : (language === 'or' ? feature.or : (language === 'ti' ? feature.ti : feature.en)))}
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
                    onClick={() => router.push("/register/owner")}

                  >
                    {getTranslatedText(plan, 'cta')}
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
                    {getTranslatedText(plan, 'cta')}
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
            Need a custom enterprise solution?{" "}

            <a href="/contact" className="text-emerald-600 underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section >
  );
}
