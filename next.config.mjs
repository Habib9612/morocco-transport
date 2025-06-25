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
  // Exclude backend directory from Next.js compilation
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backend/**', '**/node_modules/**']
    }
    return config
  },
  // Exclude backend from file watching
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken']
  }
}

export default nextConfig
