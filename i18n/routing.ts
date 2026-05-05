import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'ru', 'es', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Disable auto-redirect by Accept-Language / NEXT_LOCALE cookie. Without this,
  // a non-EN visitor on any English-only article (which next.config.mjs forces
  // back to /{slug}) gets bounced to /{locale}/{slug} by next-intl, then back
  // to /{slug} by next.config — infinite redirect loop. Users switch language
  // explicitly via LanguageSwitcher.
  localeDetection: false,
});
