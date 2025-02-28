import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
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
        hostname: "source.unsplash.com",
        pathname: "/**", // Allow any path
      },

      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**", // Allow any path
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", // Allow any path
      },
    ],
  },
};

export default nextConfig;
