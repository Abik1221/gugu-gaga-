import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Registration",
  description:
    "Register as an affiliate to grow your network and earn rewards.",
  keywords: [
    "affiliate registration",
    "affiliate marketing",
    "earn rewards",
    "mymesob",
    "bussiness managment",
    "inventory management",
  ],
  openGraph: {
    title: "Affiliate Registration",
    description:
      "Register as an affiliate to grow your network and earn rewards.",
    url: "https://mymesob.com/register/affiliate",
    siteName: "Affiliate Portal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affiliate Registration",
    description:
      "Register as an affiliate to grow your network and earn rewards.",
  },
};

const AffiliateLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AffiliateLayout;
