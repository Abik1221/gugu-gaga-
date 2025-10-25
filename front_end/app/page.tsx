"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import LogoImage from "@/public/logo.jpg";
import NavBar from "@/components/layout/NavBar";
import HowItWorks from "@/components/sections/HowItWorks";
import SecurityFeatures from "@/components/sections/SecurityFeatures";
import Pricing from "@/components/sections/Pricing";
import Solutions from "@/components/sections/Solutions";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Benefits from "@/components/sections/Benefits";
import CTA from "@/components/sections/Cta";
import WhoIsZemenPharma from "@/components/sections/WhoIsZemenPharma";
import { Button } from "@/components/ui/button";
export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setIsOpen(false);
    }
  };
  return (
    <div className="relative">
      <Image
        className="fixed z-999 top-5 left-5 w-15 h-12"
        src={LogoImage}
        alt="logo-image"
      />
      <a href="/auth/affiliate-login">
        <Button
          size="lg"
          variant="outline"
          className="z-999 hidden md:block md:fixed cursor-pointer fixed top-8 right-5 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          Affiliate
        </Button>
      </a>
      <Hero handleScrollToSection={handleScrollToSection} />
      <div className="min-h-screen bg-emerald-50 px-4 py-10">
        <NavBar
          isOpen={isOpen}
          scrolled={scrolled}
          setIsOpen={setIsOpen}
          setScrolled={setScrolled}
          handleScrollToSection={handleScrollToSection}
        />
        <WhoIsZemenPharma />
        <Features />
        <Solutions />
        <SecurityFeatures />
        <HowItWorks />
        <Benefits />
        <Pricing />
        <CTA />
      </div>
      <div className="fixed bottom-6 right-6 z-999">
        <a href="/register">
          <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">Get Started (Pharmacy Owner)</Button>
        </a>
      </div>
    </div>
  );
}
