/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       {
  //         source: "/product/:productId/:path*",
  //         destination: "/:path*",
  //       },
  //     ],
  //     afterFiles: [],
  //     fallback: [],
  //   };
  // },
  eslint: {
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
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
