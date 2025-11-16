import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Sign-In",
  description:
    "Sign in as an owner to access your business dashboard and manage operations.",
  keywords: ["owner sign-in", "business dashboard", "manage operations"],
  openGraph: {
    title: "Owner Sign-In",
    description:
      "Sign in as an owner to access your business dashboard and manage operations.",
    url: "https://mymesob.com/owner-signin",
    siteName: "Business Portal",
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
    title: "Owner Sign-In",
    description:
      "Sign in as an owner to access your business dashboard and manage operations.",
    images: ["/mesoblogo.jpeg"],
  },
};

const OwnerSignInLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default OwnerSignInLayout;
