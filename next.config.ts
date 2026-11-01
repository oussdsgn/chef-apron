import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // Product photos are resized in the browser before upload, but allow some headroom.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
