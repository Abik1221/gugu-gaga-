import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { InstallPWA } from "@/components/pwa/InstallPWA";
import logoImage from "@/public/mesoblogo.jpeg";

// Removed force-dynamic for better performance

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://mymesob.com"
  ),
  title: {
    default:
      "MesobAI - AI-Powered Bussiness Management System | Ethiopia | Africa",
    template: "%s | MesobAI - AI in Business Solutions",
  },
  description:
    "MesobAI: Revolutionary AI in business solution for Ethiopian bussinesses. Advanced mesob technology platform offering AI-powered bussiness management, inventory control, and business intelligence for Ethiopia's bussiness sector.",
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
    "bussiness management software",
    "retail management system",
    "POS system Ethiopia",
    "business software Africa",
    "Ethiopian tech startup",
    "African SaaS platform",
  ],
  authors: [{ name: "Mesob Tech", url: "https://mymesob.com" }],
  creator: "Mesob Tech",
  publisher: "Mesob Tech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mymesob.com",
    siteName: "MesobAI - AI Business Management Software",
    title: "MesobAI - AI-Powered Bussiness Management System for Ethiopia",
    description:
      "MesobAI: Revolutionary AI in business solution for Ethiopian bussiness. Advanced mesob technology platform.",
    images: [
      {
        url: "/mesoblogo.jpeg",
        width: 512,
        height: 512,
        alt: "MesobAI Logo - AI in Ethiopia Business Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MesobAI - AI in Ethiopia Business Solutions",
    description:
      "Revolutionary mesob AI technology for Ethiopian bussiness management and healthcare business intelligence.",
    images: ["/mesoblogo.jpeg"],
    creator: "@MesobAI",
  },
  alternates: {
    canonical: "https://mymesob.com",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/mesoblogo.jpeg", sizes: "192x192" },
      { url: "/mesoblogo.jpeg", sizes: "512x512" },
    ],
    apple: [{ url: "/mesoblogo.jpeg", sizes: "180x180" }],
    shortcut: "/mesoblogo.jpeg",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Mesob",
    "google-site-verification":
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9433053488658352"
          crossOrigin="anonymous"
        ></script>
        <link rel="icon" href="/mesoblogo.jpeg" type="image/jpeg" sizes="any" />
        <link
          rel="icon"
          href="/mesoblogo.jpeg"
          type="image/jpeg"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/mesoblogo.jpeg"
          type="image/jpeg"
          sizes="16x16"
        />
        <link rel="apple-touch-icon" href="/mesoblogo.jpeg" sizes="180x180" />
        <link rel="shortcut icon" href="/mesoblogo.jpeg" type="image/jpeg" />
        <link rel="canonical" href="https://mymesob.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MesobAI - AI-Powered Bussiness Management System",
              description:
                "MesobAI: Revolutionary AI in business solution for Ethiopian bussinesses. Advanced mesob technology platform offering AI-powered bussiness management.",
              url: "https://mymesob.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              image: "https://mymesob.com/mesoblogo.jpeg",
              logo: "https://mymesob.com/mesoblogo.jpeg",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "30-day free trial",
              },
              author: {
                "@type": "Organization",
                name: "MesobAI Technologies",
                url: "https://mymesob.com",
                logo: "https://mymesob.com/mesoblogo.jpeg",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
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
