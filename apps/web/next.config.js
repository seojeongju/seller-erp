/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ['@seller-erp/ui', '@seller-erp/types'],
  images: {
    unoptimized: true, // Vercel에서 정적 이미지 문제 해결을 위해
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
