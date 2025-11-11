"use client";
import NavBar from "@/components/layout/NavBar";
import { useEffect, useState } from "react";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Removed force-dynamic for better performance

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
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
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
      {isOpen ? <Dialog>
        <DialogContent>hello dialog</DialogContent>
      </Dialog> : null}
      <Navbar onOpenDialog={() => setIsOpen(true)} />
      <div className="mt-10">{children}</div>
      <Footer />
    </div>
  );
}
