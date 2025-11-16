import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Registration",
  description:
    "Register as an owner to manage your business and access exclusive tools.",
  keywords: [
    "owner registration",
    "business management",
    "exclusive owner tools",
    "inventory management",
  ],
  openGraph: {
    title: "Owner Registration",
    description:
      "Register as an owner to manage your business and access exclusive tools.",
    url: "https://mymesob.com/register/owner", // Updated URL
    siteName: "Business Portal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owner Registration",
    description:
      "Register as an owner to manage your business and access exclusive tools.",
  },
};

const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default OwnerLayout;
