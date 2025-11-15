"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import logoImage from "@/public/mesoblogo.jpeg";

export default function AuthNavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center text-gray-900 hover:text-emerald-600 transition">
            <Image height={60} width={60} src={logoImage} alt="MesobAI logo" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/#solutions" className="text-gray-600 hover:text-gray-900 transition-colors">
              Solutions
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-4">
              <Link href="/register">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}