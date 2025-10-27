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
import Footer from "@/components/sections/Footer";
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
      <Footer />
    </div>
  );
}
