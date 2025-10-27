"use client";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/sections/Footer";
import { useEffect, useState } from "react";

// Auth layout (no header maybe)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div>
      <NavBar
        isOpen={isOpen}
        scrolled={scrolled}
        setIsOpen={setIsOpen}
        setScrolled={setScrolled}
        handleScrollToSection={handleScrollToSection}
      />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
