import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";

export const metadata: Metadata = {
  title: {
    default: "Mesob - AI-Powered Business Management Software | Ethiopia",
    template: "%s | Mesob - Business Management Software",
  },
  description:
    "Transform your business with Mesob's AI-powered management software. Multi-tenant SaaS platform for inventory management, billing, analytics, and business automation. Built in Ethiopia for African businesses.",
  keywords: [
    "business management software",
    "AI business automation",
    "inventory management system",
    "multi-tenant SaaS platform",
    "Ethiopian business software",
    "African business solutions",
    "cloud-based management",
    "business analytics dashboard",
    "automated billing system",
    "enterprise resource planning",
    "small business software",
    "business intelligence tools"
  ],
  authors: [{name: "Mesob Tech"}],
  creator: "Mesob Tech",
  publisher: "Mesob Tech",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mymesob.com",
    siteName: "Mesob AI Business Management Software",
    title: "AI-Powered Business Management Software - Mesob AI",
    description: "Revolutionary business management platform with AI automation, multi-tenant architecture, and comprehensive analytics for modern businesses.",
    images: [{
      url: "/hero.jpg",
      width: 1200,
      height: 630,
      alt: "Mesob AI Business Management Dashboard"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Management Software - Zemen Pharma",
    description: "Transform your business operations with AI-powered management tools, analytics, and automation.",
    images: ["/hero.jpg"]
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.jpg", sizes: "192x192" },
      { url: "/icons/icon-512x512.jpg", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/icon-192x192.jpg" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Zemen Pharma",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID} />
        <meta name="geo.region" content="ET" />
        <meta name="geo.country" content="Ethiopia" />
        <meta name="language" content="en" />
        <link rel="canonical" href="https://zemenpharma.com" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Zemen Pharma Business Management Software",
              "description": "AI-powered business management platform with multi-tenant architecture, inventory management, billing automation, and business analytics.",
              "url": "https://zemenpharma.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "30-day free trial available"
              },
              "creator": {
                "@type": "Organization",
                "name": "Zemen Pharma",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "ET"
                }
              },
              "featureList": [
                "AI-powered business automation",
                "Multi-tenant SaaS architecture",
                "Inventory management system",
                "Automated billing and invoicing",
                "Business analytics dashboard",
                "Real-time reporting",
                "Cloud-based platform"
              ]
            })
          }}
        />
      </head>
      <body
        className="font-sans antialiased overflow-x-hidden"
      >
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
        <ServiceWorkerProvider />
      </body>
    </html>
  );
}
