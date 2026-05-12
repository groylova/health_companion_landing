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
      // the same content. Slugs with real translations (e.g. /alternative-to-
      // myfitnesspal, /alternative-to-lose-it) are not in this list — their
      // localized URLs stay reachable and indexable.
      {
        source:
          '/:locale(de|ru|es|fr)/:slug(chat-calorie-tracker|ai-food-journal|calorie-tracking-without-stress|calorie-tracker-eating-disorders|no-dinner-ideas-calories|how-to-stay-consistent-calorie-tracking|photo-vs-chat-calorie-tracking)',
        destination: '/:slug',
        permanent: true,
      },
      // /food-diary-for-weight-loss is translated to FR + DE + ES but not RU —
      // strip only the un-translated locale prefixes back to canonical EN.
      {
        source: '/:locale(ru)/food-diary-for-weight-loss',
        destination: '/food-diary-for-weight-loss',
        permanent: true,
      },
    ];
  },
  // Keep default (SSR/SSG) for best SEO + API routes.
};

export default withNextIntl(nextConfig);
