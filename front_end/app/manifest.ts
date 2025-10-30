import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zemen Pharma",
    short_name: "Zemen",
    description:
      "Zemen Pharma platform for managing pharmacy operations and subscriptions.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#0f172a",
    background_color: "#ffffff",
    lang: "en",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icons/icon-512x512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/icons/icon-512x512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
