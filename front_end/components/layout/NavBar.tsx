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

type NavItem = {
  id: string;
  label: string;
  href?: string;
};

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
  const navItems: readonly NavItem[] = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "ai-solutions", label: "Solutions" },
    { id: "pricing", label: "Pricing" },
    { id: "cta", label: "Contact", href: "/contact" },
    // { id: "affiliate", label: "Affiliate" },
  ] as const;

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
          "hidden lg:block mx-auto w-fit fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-2xl",
          "bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_-35px_rgba(59,130,246,0.45)]",
          scrolled ? "scale-105 shadow-[0_25px_80px_-35px_rgba(16,185,129,0.55)]" : "",
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
                      if (item.href) {
                        router.push(item.href);
                        return;
                      }
                      if (pathname !== "/") {
                        router.push(`/#${item.id}`);
                      } else {
                        handleScrollToSection(item.id);
                      }
                    }}
                    className={[
                      "group relative cursor-pointer rounded-lg px-6 py-3 font-medium text-sm uppercase tracking-wide transition-all duration-300",
                      "text-emerald-100 group-hover:text-white",
                    ].join(" ")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.55), rgba(59,130,246,0.45))" }}
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
                    "group relative rounded-lg px-6 py-3 font-medium text-sm uppercase tracking-wide transition-all duration-300",
                    "text-emerald-100 group-hover:text-white",
                  ].join(" ")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5 * 0.1 + 0.3 }}
                >
                  <span className="relative z-10">
                    <Link href="/register/affiliate" className="text-white">
                      Affiliate
                    </Link>
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.55), rgba(59,130,246,0.45))" }}
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
        className="fixed top-6 right-6 z-50 lg:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 w-12 rounded-xl border border-white/20 bg-white/10 p-0 text-white shadow-[0_20px_60px_-35px_rgba(59,130,246,0.45)] transition-all duration-300 hover:border-emerald-300 hover:bg-white/15"
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
            className="w-72 border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 p-6 text-white backdrop-blur-2xl shadow-[0_35px_120px_-50px_rgba(16,185,129,0.65)]"
          >
            <motion.div
              className="mt-6 flex flex-col space-y-4"
              variants={menuVariants}
              initial="closed"
              animate="open"
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                      setIsOpen(false);
                      return;
                    }
                    if (pathname !== "/") {
                      router.push(`/#${item.id}`);
                      setIsOpen(false);
                    } else {
                      handleScrollToSection(item.id);
                      setIsOpen(false);
                    }
                  }}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-emerald-100 transition-all duration-300 hover:border-emerald-300/60 hover:bg-white/12 hover:text-white hover:shadow-[0_18px_48px_-30px_rgba(16,185,129,0.55)]"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    x: 10,
                    backgroundColor: "rgba(16, 185, 129, 0.18)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    <span className="mr-3 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
}
