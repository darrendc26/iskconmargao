import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.join(__dirname, "../.."));

const api =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const config: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NEXT_PUBLIC_MAPS_URL:
      process.env.NEXT_PUBLIC_MAPS_URL ||
      process.env.GOOGLE_MAPS_DIRECTIONS_URL ||
      "https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts",
    NEXT_PUBLIC_WHATSAPP_CHANNEL_URL:
      process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || process.env.WHATSAPP_CHANNEL_URL || "",
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${api.replace(/\/$/, "")}/api/:path*` },
      { source: "/media/:path*", destination: `${api.replace(/\/$/, "")}/media/:path*` },
    ];
  },
};

export default config;
