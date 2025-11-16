import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplier Sign-In",
  description:
    "Sign in as a supplier to access your dashboard and manage your inventory.",
  keywords: ["supplier sign-in", "supplier dashboard", "manage inventory"],
  openGraph: {
    title: "Supplier Sign-In",
    description:
      "Sign in as a supplier to access your dashboard and manage your inventory.",
    url: "https://mymesob.com/supplier-signin",
    siteName: "Supplier Portal",
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
    title: "Supplier Sign-In",
    description:
      "Sign in as a supplier to access your dashboard and manage your inventory.",
    images: ["/mesoblogo.jpeg"],
  },
};

const SupplierSignInLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default SupplierSignInLayout;
