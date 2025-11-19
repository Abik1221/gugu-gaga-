"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TrialDialog } from "@/components/ui/trial-dialog";
import { RoleSelectionDialog } from "@/components/ui/role-selection-dialog";
import { ComingSoonDialog } from "@/components/ui/coming-soon-dialog";
import { InstallButton } from "@/components/pwa/InstallPWA";
import logoImage from "@/public/mesoblogo.jpeg";
import Image from "next/image";
export default function Navbar() {
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
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex itshadowems-center">
            <Link href="/">
              <motion.div
                className="flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  height={60}
                  width={60}
                  src={logoImage}
                  alt="Mesob Logo"
                />
              </motion.div>
            </Link>
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-1 xl:space-x-3">
                <Link
                  href="/#features"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  How It Works
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Privacy
                </Link>
                <Link
                  href="/#pricing"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="/#integrations"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Integrations
                </Link>

              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <InstallButton />
            <ComingSoonDialog>
              <Button variant="ghost" size="sm" className="text-black">
                Sign In
              </Button>
            </ComingSoonDialog>
            <ComingSoonDialog>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Start Free Trial
              </Button>
            </ComingSoonDialog>
          </div>
          <div className="lg:hidden flex items-center space-x-2">
            <InstallButton />
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
              <Link
                href="/#features"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/privacy"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/#pricing"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/#integrations"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Integrations
              </Link>

              <div className="px-3 py-2 space-y-2 pt-4 border-t border-gray-200">
                <InstallButton fullWidth={true} />
                <ComingSoonDialog>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </ComingSoonDialog>
                <ComingSoonDialog>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Start Free Trial
                  </Button>
                </ComingSoonDialog>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
