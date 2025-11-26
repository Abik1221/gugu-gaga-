"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImage from "@/public/mesoblogo.jpeg";
import Navbar from "@/components/sections/Navbar";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSuccess(true);
    setLoading(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", email: "", company: "", message: "" });
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.contactPage.title.split(' ').slice(0, 2).join(' ')}{' '}
            <span className="text-emerald-600">{t.contactPage.title.split(' ').slice(2).join(' ')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {t.contactPage.formHeading}
              </h3>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {t.contactPage.successTitle}
                  </h4>
                  <p className="text-gray-600">
                    {t.contactPage.successMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.contactPage.nameLabel}
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.contactPage.emailLabel}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.contactPage.companyLabel}
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.contactPage.messageLabel}
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t.contactPage.messagePlaceholder}
                      className="bg-white border-gray-300 ocus:border-emerald-500 focus:ring-emerald-500"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  >
                    {loading ? t.contactPage.submitting : t.contactPage.submitButton}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {t.contactPage.contactInfoHeading}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.contactPage.emailHeading}</h4>
                    <p className="text-gray-600">{t.contactPage.emailText}</p>
                    <p className="text-sm text-gray-500">
                      {t.contactPage.emailResponseTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.contactPage.phoneHeading}</h4>
                    <p className="text-gray-600">{t.contactPage.phoneText}</p>
                    <p className="text-sm text-gray-500">
                      {t.contactPage.phoneHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.contactPage.officeHeading}</h4>
                    <p className="text-gray-600">{t.contactPage.officeAddress}</p>
                    <p className="text-sm text-gray-500">
                      {t.contactPage.officeHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-emerald-900 mb-2">
                      {t.contactPage.demoExpectationsHeading}
                    </h4>
                    <ul className="space-y-2 text-sm text-emerald-800">
                      <li>{t.contactPage.demoExpectation1}</li>
                      <li>{t.contactPage.demoExpectation2}</li>
                      <li>{t.contactPage.demoExpectation3}</li>
                      <li>{t.contactPage.demoExpectation4}</li>
                      <li>{t.contactPage.demoExpectation5}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
