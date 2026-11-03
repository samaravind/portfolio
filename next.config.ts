import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-preview",
  devIndicators: false,
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
