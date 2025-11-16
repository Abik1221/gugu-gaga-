import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Sign-In",
  description:
    "Sign in as an affiliate to access your dashboard and track your performance.",
  keywords: [
    "affiliate sign-in",
    "affiliate dashboard",
    "track performance",
    "bussiness management",
  ],
  openGraph: {
    title: "Affiliate Sign-In",
    description:
      "Sign in as an affiliate to access your dashboard and track your performance.",
    url: "https://mymesob.com/affiliate-signin",
    siteName: "Affiliate Portal",
    images: [
      {
        url: "/mesoblogo.jpeg",
        width: 80,
        height: 80,
        alt: "Mesob Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Affiliate Sign-In",
    description:
      "Sign in as an affiliate to access your dashboard and track your performance.",
    images: ["/mesoblogo.jpeg"],
  },
};

const AffiliateSignInLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AffiliateSignInLayout;
