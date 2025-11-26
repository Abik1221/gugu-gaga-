"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";
import Navbar from "@/components/sections/Navbar";
import { useLanguage } from "@/contexts/language-context";

const sections = [
  { key: 'section1' },
  { key: 'section2' },
  { key: 'section3' },
  { key: 'section4' },
  { key: 'section5' },
  { key: 'section6' },
  { key: 'section7' },
  { key: 'section8' },
  { key: 'section9' },
  { key: 'section10' },
];

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.privacyPage.pageTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.privacyPage.pageSubtitle}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              {t.privacyPage.lastUpdated} {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => {
              const sectionKey = section.key as 'section1' | 'section2' | 'section3' | 'section4' | 'section5' | 'section6' | 'section7' | 'section8' | 'section9' | 'section10';
              const headingKey = `${sectionKey}Heading` as keyof typeof t.privacyPage;
              const bodyKey = `${sectionKey}Body` as keyof typeof t.privacyPage;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {t.privacyPage[headingKey]}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{t.privacyPage[bodyKey]}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t.privacyPage.contactUsHeading}
            </h3>
            <p className="text-gray-600 mb-4">
              {t.privacyPage.contactUsIntro}
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                {t.privacyPage.contactEmail}{" "}
                <a
                  href="mailto:nahomkeneni4@gmail.com"
                  className="text-emerald-600 hover:underline"
                >
                  {t.contactPage.emailText}
                </a>
              </p>
              <p>{t.privacyPage.contactPhone}</p>
              <p>{t.privacyPage.contactAddress}</p>
              <p className="text-sm text-gray-600 mt-3">
                {t.privacyPage.contactBusinessHours}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/terms"
              className="text-emerald-600 hover:underline font-medium"
            >
              {t.privacyPage.termsLink}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
