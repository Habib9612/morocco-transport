/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure images domains if your application loads images from external sources
  images: {
    domains: ['maps.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // API path rewrites
  async rewrites() {
    return [
      // Proxy API requests to backend during development
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;