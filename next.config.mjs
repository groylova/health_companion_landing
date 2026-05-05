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
      // English-only SEO articles: redirect any locale-prefixed URL back to
      // the canonical English version so Google doesn't index five copies of
      // the same content. /alternative-to-myfitnesspal is not in this list
      // because it has full translations across all locales.
      {
        source:
          '/:locale(de|ru|es|fr)/:slug(chat-calorie-tracker|ai-food-journal|calorie-tracking-without-stress|calorie-tracker-eating-disorders|no-dinner-ideas-calories|how-to-stay-consistent-calorie-tracking|photo-vs-chat-calorie-tracking)',
        destination: '/:slug',
        permanent: true,
      },
      // /alternative-to-lose-it is translated to ES + DE but not RU/FR —
      // strip only the un-translated locale prefixes back to canonical EN.
      {
        source: '/:locale(ru|fr)/alternative-to-lose-it',
        destination: '/alternative-to-lose-it',
        permanent: true,
      },
    ];
  },
  // Keep default (SSR/SSG) for best SEO + API routes.
};

export default withNextIntl(nextConfig);
