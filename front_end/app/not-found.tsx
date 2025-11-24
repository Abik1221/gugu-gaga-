"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Mail, Send } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[100px]"
      />

      <div className="max-w-2xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 text-center overflow-hidden relative"
        >
          {/* Floating 404 */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600 drop-shadow-sm">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4 relative z-10 -mt-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Oops! It seems you've ventured into uncharted territory. The page you're looking for has gone missing.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <Button
              asChild
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back Home
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-8 py-6 text-lg rounded-xl transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-100"
          >
            <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">
              Need Assistance?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <a
                href="mailto:nahomkeneni4@gmail.com"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors group"
              >
                <div className="p-2 bg-gray-50 group-hover:bg-emerald-50 rounded-lg transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">nahomkeneni4@gmail.com</span>
              </a>
              <a
                href="https://t.me/nahom_keneni"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
              >
                <div className="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-lg transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <span className="font-medium">@nahom_keneni</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
