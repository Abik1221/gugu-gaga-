"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";
import Footer from "@/components/sections/Footer";

// Lazy load heavy components
const ProblemSolution = dynamic(() => import("@/components/sections/ProblemSolution"), { ssr: false });
const AISection = dynamic(() => import("@/components/sections/AISection"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"), { ssr: false });
const IntegrationsSection = dynamic(() => import("@/components/sections/IntegrationsSection"), { ssr: false });
const AffiliateSection = dynamic(() => import("@/components/sections/AffiliateSection"), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/sections/CTASection"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/ui/cookie-consent").then(mod => ({ default: mod.CookieConsent })), { ssr: false });
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

      <IntegrationsSection />
      <AffiliateSection />

      <CTASection />
      <Footer />
      <CookieConsent />
    </div>
  );
}
