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

  // Experimental features for faster builds
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },
};

export default nextConfig;
