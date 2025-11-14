import Link from "next/link";
import { Shield } from "lucide-react";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";

const sections = [
  {
    heading: "Information We Collect",
    body: `We collect business information you provide during registration including business name, owner details, TIN (Tax Identification Number), trade license, contact information, and bank account details for payment processing. We also collect transaction data, inventory records, and usage logs to provide our services effectively.`,
  },
  {
    heading: "How We Use Your Information",
    body: `Your information is used to provide platform services, process payments through Ethiopian banking systems, generate tax-compliant receipts, manage inventory, facilitate supplier connections, and provide AI-powered business insights. We comply with Ethiopian commercial regulations and never sell your personal or business data to third parties.`,
  },
  {
    heading: "Data Storage and Security",
    body: `Your data is stored securely with encryption both in transit and at rest. We implement multi-factor authentication, regular security audits, and access controls. While our infrastructure may utilize international cloud services, we ensure compliance with Ethiopian data protection standards and maintain data sovereignty where required by law.`,
  },
  {
    heading: "Compliance with Ethiopian Laws",
    body: `We operate in full compliance with Ethiopian commercial law, tax regulations, and business licensing requirements. We maintain records as required by the Ministry of Trade and Industry and Ethiopian Revenue and Customs Authority. Business transaction data is retained according to Ethiopian legal requirements (minimum 5 years for tax purposes).`,
  },
  {
    heading: "Data Sharing and Disclosure",
    body: `We share data only with trusted service providers (payment processors, SMS providers, cloud hosting) under strict confidentiality agreements. We may disclose information to Ethiopian government authorities when legally required (tax audits, regulatory compliance, court orders). We do not share your business data with competitors or unauthorized third parties.`,
  },
  {
    heading: "Payment and Financial Data",
    body: `Payment processing is handled through licensed Ethiopian payment service providers. We store bank account information securely for subscription billing and supplier payments. All financial transactions comply with National Bank of Ethiopia regulations and anti-money laundering requirements.`,
  },
  {
    heading: "Your Rights",
    body: `You have the right to access, correct, or delete your personal data. You can export your business data at any time through your account settings. For data deletion requests, we will comply within 30 days while maintaining records required by Ethiopian law. You can withdraw consent for marketing communications at any time.`,
  },
  {
    heading: "Business Data Ownership",
    body: `You retain full ownership of your business data including inventory records, customer information, sales data, and financial records. Upon account termination, you can export all your data. We act as a data processor on your behalf and do not claim ownership of your business information.`,
  },
  {
    heading: "Cookies and Tracking",
    body: `We use essential cookies for authentication and session management, and analytics cookies to improve platform performance. No third-party advertising cookies are used. You can manage cookie preferences in your browser settings, though essential cookies are required for platform functionality.`,
  },
  {
    heading: "Updates to This Policy",
    body: `We may update this policy to reflect changes in Ethiopian regulations or our services. Material changes will be communicated via email and in-app notifications at least 14 days before taking effect. Continued use after the effective date constitutes acceptance of the updated policy.`,
  },
];

export const metadata = {
  title: "Privacy Policy | Mesob AI",
  description: "Learn how Mesob AI protects and manages your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-emerald-600 transition">
              <Image height={60} width={60} src={logoImage} alt="Mesob logo" />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-emerald-600 font-medium">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
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
            <Shield className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains how Mesob AI collects, uses, and protects your personal information.
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>Email: <a href="mailto:nahomkeneni4@gmail.com" className="text-emerald-600 hover:underline">nahomkeneni4@gmail.com</a></p>
            <p>Phone: +251983446134</p>
            <p>Address: Bole, Addis Ababa, Ethiopia</p>
            <p className="text-sm text-gray-600 mt-3">Business Hours: Monday - Friday, 8:30 AM - 5:30 PM (East Africa Time)</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/terms" className="text-emerald-600 hover:underline font-medium">
            Read our Terms of Service →
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
