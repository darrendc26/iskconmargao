import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.join(__dirname, "../.."));

function getApiUrl() {
  return (
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");
}

const config: NextConfig = {
  output: "standalone",
  basePath: "/admin",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  async redirects() {
    return [
      { source: "/", destination: "/admin", permanent: false, basePath: false },
      { source: "/login", destination: "/admin/login", permanent: false, basePath: false },
    ];
  },
  async rewrites() {
    const api = getApiUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
        basePath: false,
      },
      {
        source: "/admin/api/:path*",
        destination: `${api}/api/:path*`,
        basePath: false,
      },
      {
        source: "/media/:path*",
        destination: `${api}/media/:path*`,
        basePath: false,
      },
      {
        source: "/admin/media/:path*",
        destination: `${api}/media/:path*`,
        basePath: false,
      },
    ];
  },
};

export default config;
