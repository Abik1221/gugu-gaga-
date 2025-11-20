"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RequestIntegrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    toolName: "",
    toolWebsite: "",
    useCase: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Request Received!
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Thank you for your integration request. Our team will review it and
            get back to you within 2-3 business days.
          </p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/#integrations"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Integrations
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Request Custom Integration
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about the tool you'd like to integrate with Mesob AI
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Your Company"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool/Software Name *
                  </label>
                  <Input
                    required
                    value={formData.toolName}
                    onChange={(e) =>
                      setFormData({ ...formData, toolName: e.target.value })
                    }
                    placeholder="e.g., QuickBooks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool Website
                  </label>
                  <Input
                    type="url"
                    value={formData.toolWebsite}
                    onChange={(e) =>
                      setFormData({ ...formData, toolWebsite: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Case & Requirements *
                </label>
                <Textarea
                  required
                  value={formData.useCase}
                  onChange={(e) =>
                    setFormData({ ...formData, useCase: e.target.value })
                  }
                  placeholder="Describe how you'd like to use this integration and what data you need to sync..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              We typically respond within 2-3 business days. For urgent
              requests, contact us at{" "}
              <a
                href="mailto:integrations@mesob.ai"
                className="text-emerald-600 hover:underline"
              >
                integrations@mesob.ai
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
