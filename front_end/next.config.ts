import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,  // ← turns off <Image> optimization
  },
  /* config options here */
};

export default nextConfig;
