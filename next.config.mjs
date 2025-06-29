/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ignoreDuringBuilds: true, // Removed
  },
  typescript: {
    // ignoreBuildErrors: true, // Removed
  },
  images: {
    // Enable image optimization
    domains: ['localhost', 'your-domain.com'], // Add your image domains
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    appDir: true,
  },
  // Remove unused dependencies from server bundle
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig
