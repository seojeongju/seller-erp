/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ['@seller-erp/ui', '@seller-erp/types'],
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
};

module.exports = nextConfig;

