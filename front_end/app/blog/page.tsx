"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Transforming Ethiopian Businesses in 2024",
    excerpt: "Discover how Ethiopian businesses are leveraging AI-powered management software to streamline operations, reduce costs, and boost profitability through intelligent automation.",
    date: "2024-11-20",
    readTime: "5 min read",
    category: "AI Innovation",
    image: "/ai_solution.jpg",
    slug: "ai-transforming-ethiopian-businesses-2024"
  },
  {
    id: 2,
    title: "Complete Guide to Inventory Management for Ethiopian Pharmacies",
    excerpt: "Learn best practices for pharmacy inventory management in Ethiopia, including AI-powered stock optimization, regulatory compliance, and real-time tracking solutions.",
    date: "2024-11-15",
    readTime: "8 min read",
    category: "Inventory Management",
    image: "/overview.jpeg",
    slug: "inventory-management-ethiopian-pharmacies"
  },
  {
    id: 3,
    title: "Why Ethiopian Businesses Choose Mesob AI Over International Solutions",
    excerpt: "Understanding the unique advantages of locally-built business software designed specifically for Ethiopian market needs, culture, and regulatory requirements.",
    date: "2024-11-10",
    readTime: "6 min read",
    category: "Business Strategy",
    image: "/super.jpeg",
    slug: "why-ethiopian-businesses-choose-mesob-ai"
  },
  {
    id: 4,
    title: "Digital Transformation for African Businesses: A Modern Approach",
    excerpt: "Explore how African businesses are embracing digital transformation through cloud-based solutions, AI automation, and data-driven decision making.",
    date: "2024-11-05",
    readTime: "7 min read",
    category: "Digital Transformation",
    image: "/heroImage.jpg",
    slug: "digital-transformation-african-businesses"
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
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-emerald-200/50 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                      <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold group/link transition-colors"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
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