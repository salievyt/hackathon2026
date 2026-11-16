import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';
    return {
      beforeFiles: ['api', 'admin'].map(prefix => ({
        source: `/${prefix}{/}?`,
        destination: `${backend}/${prefix}/`,
      })),
      afterFiles: [],
      fallback: [
        ...['api', 'admin'].map(prefix => ({
          source: `/${prefix}/:path+`,
          destination: `${backend}/${prefix}/:path+/`,
        })),
        ...['static', 'media'].map(prefix => ({
          source: `/${prefix}/:path+`,
          destination: `${backend}/${prefix}/:path+`,
        })),
      ],
    };
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'evoflare-api.vercel.app', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },
      { protocol: 'http', hostname: 'localhost', port: '8000' },
    ],
  },
};

export default withNextIntl(nextConfig);
