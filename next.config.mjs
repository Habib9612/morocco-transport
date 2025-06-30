/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ignoreDuringBuilds: true, // Removed
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization
    domains: ['localhost', 'your-domain.com'], // Add your image domains
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Example value, adjust as needed
    },
  },
  // Remove unused dependencies from server bundle
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig
