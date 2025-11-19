import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { RouteGuard } from "@/components/auth/route-guard";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MesobAI - AI-Powered Pharmacy Management",
  description: "Revolutionary AI in Business Solutions for Ethiopian Healthcare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider />
          <RouteGuard>
            {children}
          </RouteGuard>
        </AuthProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(() => console.log('SW registration failed'));
            }
            
            // Check for updates every 30 seconds
            setInterval(async () => {
              try {
                const response = await fetch('/version.json?' + Date.now());
                const data = await response.json();
                const currentVersion = localStorage.getItem('app_version');
                
                if (currentVersion && currentVersion !== data.version) {
                  if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                  }
                  localStorage.setItem('app_version', data.version);
                  window.location.reload();
                } else if (!currentVersion) {
                  localStorage.setItem('app_version', data.version);
                }
              } catch (error) {
                console.warn('Version check failed:', error);
              }
            }, 30000);
          `}
        </Script>
      </body>
    </html>
  );
}