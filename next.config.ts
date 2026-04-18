import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
};

export default nextConfig;


module.exports = {
  allowedDevOrigins: ['192.168.1.100'],
}