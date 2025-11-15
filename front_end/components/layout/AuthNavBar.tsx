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

          </div>
        </div>
      </div>
    </nav>
  );
}