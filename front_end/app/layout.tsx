import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { InstallPWA } from "@/components/pwa/InstallPWA";
import logoImage from "@/public/mesoblogo.jpeg";

// Removed force-dynamic for better performance

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://mymesob.com'),
  title: {
    default: "Mesob - AI-Powered Business Management Software | Ethiopia | Africa",
    template: "%s | Mesob - Business Management Software",
  },
  description:
    "Transform your business with Mesob's AI-powered management software. Multi-tenant SaaS platform for inventory management, billing, analytics, and business automation. Built in Ethiopia for African businesses. Start your 30-day free trial today.",
  keywords: [
    "business management software Ethiopia",
    "AI business automation Africa",
    "inventory management system",
    "multi-tenant SaaS platform",
    "Ethiopian business software",
    "African business solutions",
    "cloud-based management",
    "business analytics dashboard",
    "automated billing system",
    "enterprise resource planning ERP",
    "small business software Africa",
    "business intelligence tools",
    "pharmacy management software",
    "retail management system",
    "POS system Ethiopia",
    "business software Africa",
    "Ethiopian tech startup",
    "African SaaS platform"
  ],
  authors: [{name: "Mesob Tech", url: "https://mymesob.com"}],
  creator: "Mesob Tech",
  publisher: "Mesob Tech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mymesob.com",
    siteName: "Mesob - AI Business Management Software",
    title: "AI-Powered Business Management Software - Built in Ethiopia for Africa",
    description: "Revolutionary business management platform with AI automation, multi-tenant architecture, and comprehensive analytics for modern businesses. 30-day free trial available.",
    images: [{
      url: "/hero.jpg",
      width: 1200,
      height: 630,
      alt: "Mesob AI Business Management Dashboard - Ethiopian Business Software"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Management Software - Built in Ethiopia for Africa",
    description: "Transform your business operations with AI-powered management tools, analytics, and automation. Start your free trial today.",
    images: ["/hero.jpg"],
    creator: "@MesobTech"
  },
  alternates: {
    canonical: "https://mymesob.com",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: logoImage.src },
      { url: "/icons/icon-192x192.jpg", sizes: "192x192" },
      { url: "/icons/icon-512x512.jpg", sizes: "512x512" },
    ],
    apple: [{ url: logoImage.src }],
    shortcut: logoImage.src,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Mesob",
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/mesoblogo.jpeg" type="image/jpeg" sizes="any" />
        <link rel="icon" href="/mesoblogo.jpeg" type="image/jpeg" sizes="32x32" />
        <link rel="icon" href="/mesoblogo.jpeg" type="image/jpeg" sizes="16x16" />
        <link rel="apple-touch-icon" href="/mesoblogo.jpeg" sizes="180x180" />
        <link rel="shortcut icon" href="/mesoblogo.jpeg" type="image/jpeg" />
        <link rel="canonical" href="https://mymesob.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Mesob AI Business Management Software",
              "description": "AI-powered business management software built in Ethiopia for African businesses. Multi-tenant SaaS platform for inventory, billing, and analytics.",
              "url": "https://mymesob.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "30-day free trial"
              },
              "author": {
                "@type": "Organization",
                "name": "Mesob Tech",
                "url": "https://mymesob.com"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
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
          <InstallPWA />
        </ToastProvider>
        <ServiceWorkerProvider />
      </body>
    </html>
  );
}
