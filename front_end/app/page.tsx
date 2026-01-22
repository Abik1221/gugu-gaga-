"use client";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSolution from "@/components/sections/ProblemSolution";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AISection from "@/components/sections/AISection";
import HowItWorks from "@/components/sections/HowItWorks";

import PricingSection from "@/components/sections/PricingSection";

import AffiliateSection from "@/components/sections/AffiliateSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { GoogleAds } from "@/components/ads/google-ads";

export default function App() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mesob Tech",
    "url": "https://mymesob.com",
    "logo": "https://mymesob.com/mesoblogo.jpeg",
    "description": "AI-powered business management software built in Ethiopia for African businesses",
    "foundingLocation": {
      "@type": "Place",
      "name": "Ethiopia"
    },
    "areaServed": "Africa",
    "sameAs": [
      "https://twitter.com/MesobTech",
      "https://linkedin.com/company/mesob-tech"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white overflow-x-hidden will-change-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <div className="pt-16">
        <HeroSection />
      </div>
      <ProblemSolution />
      <FeaturesSection />
      <AISection />
      <HowItWorks />

      <PricingSection />
      {/* <GoogleAds adSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT || "1234567890"} className="my-8" /> */}

      <AffiliateSection />

      <CTASection />
      <Footer />
      <CookieConsent />
    </div>
  );
}
