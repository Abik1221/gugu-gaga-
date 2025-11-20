import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesob AI Blog - Ethiopian Business Software Insights & News",
  description: "Latest insights on business management software in Ethiopia. Learn about AI automation, inventory management, and business growth strategies for Ethiopian enterprises.",
  keywords: ["Mesob AI blog", "Ethiopian business software news", "business management Ethiopia", "AI business automation Ethiopia"],
};

const blogPosts = [
  {
    id: 1,
    title: "How AI is Transforming Ethiopian Businesses in 2024",
    excerpt: "Discover how Ethiopian businesses are leveraging AI-powered management software to streamline operations and boost profitability.",
    date: "2024-01-15",
    slug: "ai-transforming-ethiopian-businesses-2024"
  },
  {
    id: 2,
    title: "Complete Guide to Inventory Management for Ethiopian Pharmacies",
    excerpt: "Learn best practices for pharmacy inventory management in Ethiopia, including AI-powered stock optimization and regulatory compliance.",
    date: "2024-01-10",
    slug: "inventory-management-ethiopian-pharmacies"
  },
  {
    id: 3,
    title: "Why Ethiopian Businesses Choose Mesob AI Over International Solutions",
    excerpt: "Understanding the unique advantages of locally-built business software designed specifically for Ethiopian market needs.",
    date: "2024-01-05",
    slug: "why-ethiopian-businesses-choose-mesob-ai"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mesob AI Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and news about business management software for Ethiopian enterprises
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <time className="text-sm text-gray-500">{post.date}</time>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                  Business Software
                </span>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-emerald-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Get the latest insights on Ethiopian business software and AI automation delivered to your inbox.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Subscribe to Updates
          </Link>
        </div>
      </div>
    </div>
  );
}