import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

// SEO articles per slug, mapped to the locales they are translated to. The
// default locale must be included. Sitemap entries and hreflang alternates
// span only these locales; pages in other locales render EN with noindex
// (set by the article layout) and never make it to the sitemap.
const TRANSLATED_SEO_SLUGS: Record<string, string[]> = {
  'alternative-to-myfitnesspal': ['en', 'de', 'ru', 'es', 'fr'],
  'alternative-to-lose-it': ['en', 'de', 'ru', 'es', 'fr'],
  'food-diary-for-weight-loss': ['en', 'fr', 'de'],
};

// Slugs of SEO articles that exist only in English. A single entry per slug.
const ENGLISH_ONLY_SEO_SLUGS = [
  'chat-calorie-tracker',
  'ai-food-journal',
  'calorie-tracking-without-stress',
  'calorie-tracker-eating-disorders',
  'no-dinner-ideas-calories',
  'how-to-stay-consistent-calorie-tracking',
  'photo-vs-chat-calorie-tracking',
];

function localizedUrl(base: string, locale: string, path = ''): string {
  if (locale === routing.defaultLocale) {
    return path === '' ? `${base}/` : `${base}${path}`;
  }
  return `${base}/${locale}${path}`;
}

function buildLanguageAlternates(
  base: string,
  path: string,
  locales: readonly string[] = routing.locales,
): Record<string, string> {
  const languages: Record<string, string> = {
    'x-default': localizedUrl(base, routing.defaultLocale, path),
  };
  for (const loc of locales) {
    languages[loc] = localizedUrl(base, loc, path);
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Home — one entry per locale with full hreflang alternates on each
  const homeAlternates = buildLanguageAlternates(base, '');
  for (const loc of routing.locales) {
    entries.push({
      url: localizedUrl(base, loc, ''),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: homeAlternates },
    });
  }

  // Translated SEO articles — one entry per translated locale, with
  // hreflang alternates spanning only the locales we actually translated.
  for (const [slug, locales] of Object.entries(TRANSLATED_SEO_SLUGS)) {
    const path = `/${slug}`;
    const alternates = buildLanguageAlternates(base, path, locales);
    for (const loc of locales) {
      entries.push({
        url: localizedUrl(base, loc, path),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  // English-only SEO articles — single entry each
  for (const slug of ENGLISH_ONLY_SEO_SLUGS) {
    entries.push({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Legal pages — English only
  for (const slug of ['legal/privacy', 'legal/terms', 'legal/ai-disclosure']) {
    entries.push({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    });
  }

  return entries;
}
