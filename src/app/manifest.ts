import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Template Dashboard",
    short_name: "Template",
    description: "Template Dashboard",
    start_url: "/de/dashboard",
    display: "standalone",
    background_color: "#0B0F14",
    theme_color: "#3B82F6",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
