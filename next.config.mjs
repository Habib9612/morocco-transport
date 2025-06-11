/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ignoreDuringBuilds: true, // Removed
  },
  typescript: {
    // ignoreBuildErrors: true, // Removed
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
