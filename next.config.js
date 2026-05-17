/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**' }
    ]
  },
  experimental: {
    serverActions: { bodySizeLimit: '25mb' }
  },
  async headers() {
    return [
      {
        source: '/api/wp/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.WP_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Shutterly-Key' }
        ]
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
