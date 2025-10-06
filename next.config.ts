import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com"], // Add your external image domain here
  },
  // devIndicators: false
  reactStrictMode: false
};

export default nextConfig;
