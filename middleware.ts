import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Only run on the main page and locale-prefixed paths.
  // SEO articles, legal, API, and static files bypass middleware entirely.
  matcher: ['/', '/(de|ru|es|fr)/:path*'],
};
