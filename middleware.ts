import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match the main page, locale-prefixed paths, and SEO content slugs
  // (so /chat-calorie-tracker resolves to default EN, /de/chat-calorie-tracker to DE, etc).
  // Legal pages, API, and static files bypass middleware.
  matcher: [
    '/',
    '/(de|ru|es|fr)/:path*',
    '/(chat-calorie-tracker|ai-food-journal|calorie-tracking-without-stress|alternative-to-myfitnesspal|calorie-tracker-eating-disorders|no-dinner-ideas-calories|how-to-stay-consistent-calorie-tracking|photo-vs-chat-calorie-tracking)',
  ],
};
