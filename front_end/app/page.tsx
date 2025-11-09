"use client";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSolution from "@/components/sections/ProblemSolution";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AISection from "@/components/sections/AISection";
import HowItWorks from "@/components/sections/HowItWorks";
import SecuritySection from "@/components/sections/SecuritySection";
import PricingSection from "@/components/sections/PricingSection";
import IntegrationsSection from "@/components/sections/IntegrationsSection";
import AffiliateSection from "@/components/sections/AffiliateSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { GoogleAds } from "@/components/ads/google-ads";
export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSolution />
      <FeaturesSection />
      <AISection />
      <HowItWorks />
      <SecuritySection />
      <PricingSection />
      {/* <GoogleAds adSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT || "1234567890"} className="my-8" /> */}
      <IntegrationsSection />
      <AffiliateSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <CookieConsent />
    </div>
  );
}
