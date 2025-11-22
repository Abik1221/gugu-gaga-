"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 sm:space-y-8"
        >
          {/* 404 Number with gradient */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-[100px] sm:text-[140px] font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl -z-10" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2 sm:space-y-3 px-4"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center pt-2 px-4"
          >
            <Button
              asChild
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-4 sm:py-5 text-sm sm:text-base"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-5 sm:px-6 py-4 sm:py-5 text-sm sm:text-base"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>

          {/* Support info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-3 sm:pt-4 text-xs sm:text-sm text-gray-500 px-4"
          >
            Need help? Contact us at{" "}
            <a
              href="mailto:nahomkenei4@gmail.com"
              className="text-emerald-600 hover:text-emerald-700 font-semibold break-all"
            >
              nahomkenei4@gmail.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:+251983446134"
              className="text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
            >
              +251 983 446 134
            </a>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200/30 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </div>
  );
}
