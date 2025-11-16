import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplier Registration",
  description:
    "Register as a supplier to access exclusive features and benefits.",
  keywords: [
    "supplier registration",
    "supplier portal",
    "exclusive supplier features",
  ],
  openGraph: {
    title: "Supplier Registration",
    description:
      "Register as a supplier to access exclusive features and benefits.",
    url: "https://example.com/register/supplier",
    siteName: "Supplier Portal",
    images: [
      {
        url: "/supplierregistration.jpeg",
        width: 800,
        height: 600,
        alt: "Supplier Registration Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supplier Registration",
    description:
      "Register as a supplier to access exclusive features and benefits.",
    images: ["/supplierregistration.jpeg"],
  },
};

const SupplierLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default SupplierLayout;
