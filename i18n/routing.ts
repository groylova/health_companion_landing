import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'ru', 'es', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
