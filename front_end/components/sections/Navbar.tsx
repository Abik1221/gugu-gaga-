"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TrialDialog } from "@/components/ui/trial-dialog";
import { RoleSelectionDialog } from "@/components/ui/role-selection-dialog";
import { InstallButton } from "@/components/pwa/InstallPWA";
import logoImage from "@/public/mesoblogo.jpeg";
import Image from "next/image";
import { AuthAPI, AuthProfile } from "@/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, LayoutDashboard } from "lucide-react";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await AuthAPI.me();
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    setUserMenuOpen(false);
    window.location.href = "/";
  };

  const getInitials = (user: AuthProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = (user: AuthProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email;
  };

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
                  href="/#security"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Security
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
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-emerald-600 px-2 py-2 transition-colors text-sm"
                >
                  Blog
                </Link>

              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <InstallButton />
            {loading ? (
              <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-medium text-gray-900 leading-none">
                      {getUserName(user)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-emerald-100">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 xl:hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <RoleSelectionDialog>
                  <Button variant="ghost" size="sm" className="text-black">
                    Sign In
                  </Button>
                </RoleSelectionDialog>
                <TrialDialog>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Start Free Trial
                  </Button>
                </TrialDialog>
              </>
            )}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden border-t border-gray-200 overflow-hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40"
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
                href="/#security"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Security
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
              <Link
                href="/blog"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Blog
              </Link>

              <div className="px-3 py-2 space-y-2 pt-4 border-t border-gray-200">
                <InstallButton fullWidth={true} />
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-2 py-2 mb-2 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10 border border-emerald-100">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-2">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <RoleSelectionDialog>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </RoleSelectionDialog>
                    <TrialDialog>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Start Free Trial
                      </Button>
                    </TrialDialog>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
