import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placeimg.com",
        pathname: "/**", // Allow any path
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // Allow any path
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**", // Allow any path
      },
      {
        protocol: "https",
        hostname: " api.lorem.space",
        pathname: "/**", // Allow any path
      },
    ],
  },
};

export default nextConfig;
