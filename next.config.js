/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  eslint: {
    // Completely ignore ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Completely ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  // Disable static page generation errors
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig



