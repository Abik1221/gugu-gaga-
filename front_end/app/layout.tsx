import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";

export const metadata: Metadata = {
  title: {
    default: "Zemen Pharma",
    template: "%s | Zemen Pharma",
  },
  description:
    "Zemen Pharma platform for managing pharmacy operations and subscriptions.",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
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
