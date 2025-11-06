"use client"
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DialogTrigger } from "../ui/dialog";

export default function Navbar({ onOpenDialog }: { onOpenDialog: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white text-black opacity-80 shadow-lg border-b border-gray-200"
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex itshadowems-center">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h1 className="text-emerald-600 text-lg sm:text-xl">Mesob AI</h1>
            </motion.div>
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-1 xl:space-x-3">
                <a href="#features" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  How It Works
                </a>
                <a href="#security" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  Security
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  Pricing
                </a>
                <a href="#integrations" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  Integrations
                </a>
                <Link href="/register?tab=affiliate" className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm">
                  Affiliate
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-black">Sign In</Button>
            <span onClick={() => console.log("hello")}>

              <Button variant="outline" className="bg-black hover:bg-slate-700" onClick={onOpenDialog} >Start Free Trial</Button>

            </span>
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <a
                href="#features"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                How It Works
              </a>
              <a
                href="#security"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Security
              </a>
              <a
                href="#pricing"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Pricing
              </a>
              <a
                href="#integrations"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Integrations
              </a>
              <a
                href="#affiliate"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Affiliate Program
              </a>
              <div className="px-3 py-2 space-y-2 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Start Free Trial</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
