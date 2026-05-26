import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Enable React strict mode for better performance
  reactStrictMode: true,

  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },

  async redirects() {
    return [
      {
        source: "/vipassana",
        destination: "/chotu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
