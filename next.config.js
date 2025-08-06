/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // required for next export (disables Next.js Image Optimization API)
    unoptimized: true,
    // domains isn't used for optimization when unoptimized: true,
    // but keeping it doesn't hurt if you later remove output:'export'
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
