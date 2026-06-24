import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.232.87.21', 'localhost'],
  images: {
    qualities: [75, 95],
  },
};

export default nextConfig;
