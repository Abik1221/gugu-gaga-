import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MesobAI - AI-Powered Business Inventory Management",
    short_name: "MesobAI",
    description:
      "MesobAI - AI-powered business inventory management system for Ethiopian businesses. Revolutionary mesob technology platform with intelligent automation and analytics.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    theme_color: "#10b981",
    background_color: "#ffffff",
    lang: "en",
    orientation: "any",
    categories: ["business", "productivity", "finance", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/icons/icon-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icons/icon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/icon-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/icon-152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/owner-overview.jpg",
        sizes: "1920x1080",
        type: "image/jpeg",
        form_factor: "wide",
        label: "Owner Dashboard Overview",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Open your dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }]
      },
      {
        name: "POS",
        short_name: "POS",
        description: "Point of Sale",
        url: "/dashboard/pos",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }]
      }
    ]
  };
}
