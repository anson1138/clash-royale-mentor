import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.royaleapi.com',
        pathname: '/static/img/**',
      },
      {
        protocol: 'https',
        hostname: 'api-assets.clashroyale.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
