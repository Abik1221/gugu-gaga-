import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zemen Pharma",
    template: "%s | Zemen Pharma",
  },
  description:
    "Zemen Pharma platform for managing pharmacy operations and subscriptions.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0f172a",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
