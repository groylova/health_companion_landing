import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/myfitnesspal-alternative',
        destination: '/alternative-to-myfitnesspal',
        permanent: true,
      },
      {
        source: '/stress-free-tracking',
        destination: '/calorie-tracking-without-stress',
        permanent: true,
      },
    ];
  },
  // Keep default (SSR/SSG) for best SEO + API routes.
};

export default withNextIntl(nextConfig);
