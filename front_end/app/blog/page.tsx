"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Transforming Ethiopian Businesses in 2018 EC",
    excerpt: "Ethiopian businesses are experiencing a revolutionary transformation through AI-powered management software. From automated inventory tracking to intelligent sales forecasting, AI is helping local enterprises streamline their operations, reduce operational costs by up to 40%, and boost profitability. Smart analytics provide real-time insights into business performance, while automated workflows eliminate manual data entry errors. Machine learning algorithms optimize stock levels, predict customer demand patterns, and identify profitable opportunities. This technological leap is enabling Ethiopian SMEs to compete globally while maintaining their local market dominance.",
    date: "Hidar 10, 2018 EC",
    readTime: "3 min read",
    category: "AI Innovation",
    image: "/ai_solution.jpg"
  },
  {
    id: 2,
    title: "Complete Guide to Inventory Management for Ethiopian Pharmacies",
    excerpt: "Managing pharmaceutical inventory in Ethiopia requires strict adherence to regulatory compliance, expiry tracking, and batch management. Modern inventory systems provide real-time stock monitoring, automated reorder alerts, and comprehensive batch tracking to prevent stockouts and minimize waste. AI-powered demand forecasting helps pharmacies maintain optimal stock levels while ensuring critical medications are always available. Integration with EFDA regulations ensures compliance with Ethiopian pharmaceutical standards. Advanced reporting features track expiry dates, monitor controlled substances, and generate regulatory reports automatically, saving hours of manual work.",
    date: "Tahsas 5, 2018 EC",
    readTime: "4 min read",
    category: "Inventory Management",
    image: "/overview.jpeg"
  },
  {
    id: 3,
    title: "Why Ethiopian Businesses Choose Mesob AI Over International Solutions",
    excerpt: "Ethiopian businesses face unique challenges that international software often fails to address: local tax calculations (VAT, TOT), Ethiopian calendar integration, multiple currency support (Birr, USD, EUR), and bilingual interfaces (Amharic/English). Mesob AI is built specifically for the Ethiopian market, understanding local business practices, regulatory requirements, and cultural nuances. Unlike foreign solutions that require expensive customization, Mesob AI works out-of-the-box with Ethiopian fiscal year calendars, local payment methods like CBE Birr and Telebirr, and generates reports compliant with Ethiopian tax authorities. Local support teams understand your business context and provide assistance in your language.",
    date: "Tahsas 30, 2018 EC",
    readTime: "3 min read",
    category: "Business Strategy",
    image: "/super.jpeg"
  },
  {
    id: 4,
    title: "Digital Transformation for African Businesses: A Modern Approach",
    excerpt: "African businesses are rapidly embracing digital transformation to compete in the global marketplace. Cloud-based solutions eliminate the need for expensive infrastructure while providing scalability and accessibility from anywhere. Mobile-first platforms ensure business management on-the-go, crucial for Africa's mobile-dominant markets. Data-driven decision making through advanced analytics helps businesses identify trends, optimize operations, and maximize profitability. Automation of repetitive tasks frees up staff for strategic work, while integrated systems break down data silos and improve collaboration. This digital revolution is enabling African SMEs to leapfrog traditional business models and adopt cutting-edge technologies.",
    date: "Tir 25, 2018 EC",
    readTime: "4 min read",
    category: "Digital Transformation",
    image: "/heroImage.jpg"
  }
];

export default function BlogPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 pt-24 pb-16">
        {/* Subtle Animated Background Elements - Stable for Smooth Scrolling */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/15 to-teal-200/15 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/15 to-emerald-200/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Latest Insights</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
              Mesob AI Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and news about business management software for Ethiopian enterprises
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="grid gap-8 md:grid-cols-2 mb-16"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={cardVariants}
                transition={{ duration: 0.5 }}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-200/50 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time>{post.date}</time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated with Our Latest Insights
              </h2>
              <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
                Get the latest insights on Ethiopian business software and AI automation delivered directly to you
              </p>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <span>Subscribe to Updates</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}