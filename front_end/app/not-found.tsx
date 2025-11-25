"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Mail, Send, Sparkles } from "lucide-react";
import Navbar from "@/components/sections/Navbar";

export default function NotFoundPage() {
  // Particle animation floating around
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4 overflow-hidden relative pt-16">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tl from-blue-300/30 to-emerald-300/30 rounded-full blur-[130px]"
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              opacity: 0,
            }}
            animate={{
              y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-emerald-400/40 rounded-full blur-sm"
          />
        ))}

        <div className="max-w-2xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 text-center overflow-hidden relative"
          >
            {/* Glow effect behind 404 */}
            <motion.div
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-transparent to-blue-200/30 blur-3xl"
            />

            {/* Floating Sparkles around 404 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 z-0"
            >
              <Sparkles className="w-8 h-8 text-emerald-400/50" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/3 right-1/4 z-0"
            >
              <Sparkles className="w-6 h-6 text-blue-400/50" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 left-1/3 z-0"
            >
              <Sparkles className="w-7 h-7 text-teal-400/50" />
            </motion.div>

            {/* Floating 404 with enhanced animations */}
            <motion.div
              animate={{
                y: [-12, 12, -12],
                rotateX: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 drop-shadow-2xl"
                style={{
                  textShadow: "0 0 80px rgba(16, 185, 129, 0.3)",
                }}
              >
                404
              </motion.h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4 relative z-10 -mt-6"
            >
              <motion.h2
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                Page Not Found
              </motion.h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                Oops! It seems you've ventured into uncharted territory. The page you're looking for has gone missing.
              </p>
            </motion.div>

            {/* Action Buttons with enhanced hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  asChild
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-emerald-300/50 hover:shadow-2xl hover:shadow-emerald-400/60 transition-all duration-300 font-semibold"
                >
                  <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    Back Home
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-gray-700 hover:text-emerald-700 px-10 py-7 text-lg rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Go Back
                </Button>
              </motion.div>
            </motion.div>

            {/* Support Section with enhanced styling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-200/50"
            >
              <p className="text-sm text-gray-500 mb-6 font-semibold uppercase tracking-widest">
                Need Assistance?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                <motion.a
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  href="mailto:nahomkeneni4@gmail.com"
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors group"
                >
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-emerald-50 group-hover:to-teal-50 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">nahomkeneni4@gmail.com</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  href="https://t.me/nahom_keneni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-sky-50 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-lg">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">@nahom_keneni</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
