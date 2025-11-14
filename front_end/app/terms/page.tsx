import Link from "next/link";
import { FileText } from "lucide-react";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";

const sections = [
  {
    heading: "Acceptance of Terms",
    body: `By accessing or using Mesob AI, you agree to these Terms of Service. If you're using the platform on behalf of a business, you confirm you have authority to bind that organization to these terms.`,
  },
  {
    heading: "Account Registration",
    body: `You must provide accurate information during registration and maintain the security of your account credentials. You're responsible for all activities under your account.`,
  },
  {
    heading: "Subscription and Billing",
    body: `Subscription fees are billed according to your chosen plan. Payments are non-refundable except as required by law. Late payments may result in service suspension.`,
  },
  {
    heading: "Acceptable Use",
    body: `You agree to use the platform lawfully, not interfere with service operations, and not attempt to access unauthorized areas. We reserve the right to suspend accounts that violate these terms.`,
  },
  {
    heading: "Data Ownership",
    body: `You retain ownership of your business data. By using our platform, you grant us permission to process your data to provide services and improve platform performance.`,
  },
  {
    heading: "Service Availability",
    body: `We strive for continuous service availability but don't guarantee uninterrupted access. Scheduled maintenance will be communicated in advance when possible.`,
  },
  {
    heading: "Third-Party Integrations",
    body: `Our platform integrates with third-party services. Use of these integrations is subject to their respective terms, and we're not responsible for third-party service issues.`,
  },
  {
    heading: "Termination",
    body: `Either party may terminate the agreement with 30 days notice. We may suspend access immediately for terms violations or non-payment. Upon termination, you can export your data.`,
  },
  {
    heading: "Limitation of Liability",
    body: `Mesob AI is provided "as is" without warranties. We're not liable for indirect damages. Our total liability is limited to fees paid in the preceding six months.`,
  },
  {
    heading: "Changes to Terms",
    body: `We may update these terms periodically. Material changes will be communicated at least 14 days before taking effect. Continued use constitutes acceptance of updated terms.`,
  },
];

export const metadata = {
  title: "Terms of Service | Mesob AI",
  description: "Review the terms and conditions for using Mesob AI platform.",
};

export default function TermsPage() {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-emerald-600 transition">
              <Image height={60} width={60} src={logoImage} alt="Mesob logo" />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-emerald-600 font-medium">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of Mesob AI. Please read them carefully before using our platform.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-emerald-50 rounded-lg p-6 border border-emerald-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions?</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>Email: <a href="mailto:nahomkeneni4@gmail.com" className="text-emerald-600 hover:underline">nahomkeneni4@gmail.com</a></p>
            <p>Phone: +251983446134</p>
            <p>Address: Bole, Addis Ababa, Ethiopia</p>
            <p className="text-sm text-gray-600 mt-3">Business Hours: Monday - Friday, 8:30 AM - 5:30 PM (East Africa Time)</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-emerald-600 hover:underline font-medium">
            Read our Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
