import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Firebase Storage emulator, for local development
      { protocol: "http", hostname: "127.0.0.1", port: "9199" },
    ],
  },
  experimental: {
    // Product photos are resized in the browser before upload, but allow some headroom.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
