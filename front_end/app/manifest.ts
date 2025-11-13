import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mesob - Pharmacy Management Platform",
    short_name: "Mesob",
    description:
      "Mesob - Complete pharmacy management platform for inventory, sales, and operations.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#10b981",
    background_color: "#ffffff",
    lang: "en",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/mesoblogo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/mesoblogo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/mesoblogo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
