import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  images: {
    domains: ["i.pinimg.com", "res.cloudinary.com"],
    // OR (better for newer Next.js)
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "i.pinimg.com",
    //   },
    // ],
  },
  allowedDevOrigins: ["192.168.1.100"],
};

export default nextConfig;