"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar({
  isOpen,
  setIsOpen,
  scrolled,
  setScrolled,
  handleScrollToSection,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrolled: boolean;
  setScrolled: React.Dispatch<React.SetStateAction<boolean>>;
  handleScrollToSection: (id: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "ai-solutions", label: "Solutions" },
    { id: "pricing", label: "Pricing" },
    { id: "cta", label: "Contact" },
    // { id: "affiliate", label: "Affiliate" },
  ];

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    open: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  const isGlass = scrolled;

  return (
    <>
      {/* Desktop Navigation */}
      <motion.div
        className={[
          "hidden lg:block mx-auto w-fit fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-xl",
          isGlass
            ? "bg-white/40 backdrop-blur-md border border-white/20 shadow-lg"
            : "bg-white/95 backdrop-blur-sm border border-emerald-200 shadow-lg",
          scrolled ? "scale-105 shadow-xl" : "",
        ].join(" ")}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex gap-1 px-4 py-2">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink asChild>
                  <motion.button
                    onClick={() => {
                      if (pathname !== "/") {
                        router.push(`/#${item.id}`);
                      } else {
                        handleScrollToSection(item.id);
                      }
                    }}
                    className={[
                      "px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer relative group/item",
                      isGlass
                        ? "text-emerald-800 hover:bg-white/30"
                        : "text-emerald-700 hover:bg-emerald-50",
                    ].join(" ")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.div
                      className={[
                        "absolute inset-0 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity",
                        isGlass
                          ? "bg-white/0 group-hover:bg-white/20"
                          : "bg-gradient-to-r from-emerald-100 to-green-100",
                      ].join(" ")}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <motion.button
                  className={[
                    "px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer relative group/item",
                    isGlass
                      ? "text-emerald-800 hover:bg-white/30"
                      : "text-emerald-700 hover:bg-emerald-50",
                  ].join(" ")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5 * 0.1 + 0.3 }}
                >
                  <span className="relative z-10">
                    <Link href="/register">Affiliate</Link>
                  </span>
                  <motion.div
                    className={[
                      "absolute inset-0 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity",
                      isGlass
                        ? "bg-white/0 group-hover:bg-white/20"
                        : "bg-gradient-to-r from-emerald-100 to-green-100",
                    ].join(" ")}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.div
        className="lg:hidden fixed top-6 right-6 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={[
                "h-12 w-12 border rounded-xl transition-all duration-300 p-0",
                isGlass
                  ? "bg-white/40 backdrop-blur-md border-white/30 hover:bg-white/50 shadow-lg"
                  : "bg-white/95 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 shadow-lg",
              ].join(" ")}
            >
              <motion.div
                animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-emerald-700" />
                ) : (
                  <Menu className="h-5 w-5 text-emerald-700" />
                )}
              </motion.div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-white/95 backdrop-blur-sm border-l border-emerald-200"
          >
            <motion.div
              className="flex flex-col space-y-6 mt-16"
              variants={menuVariants}
              initial="closed"
              animate="open"
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (pathname !== "/") {
                      router.push(`/#${item.id}`);
                      setIsOpen(false);
                    } else {
                      handleScrollToSection(item.id);
                      setIsOpen(false);
                    }
                  }}
                  className="text-left px-4 py-4 rounded-xl text-emerald-700 font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 border border-transparent hover:border-emerald-200"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    x: 10,
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    <motion.div
                      className="w-2 h-2 bg-emerald-400 rounded-full mr-4"
                      whileHover={{ scale: 1.5 }}
                    />
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute bottom-8 left-8 text-emerald-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Zemen Pharma
            </motion.div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
}
