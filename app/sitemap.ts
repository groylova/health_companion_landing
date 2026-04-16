import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

// Slugs of SEO articles that are fully translated across all locales. Sitemap
// will emit hreflang alternates for these. Others stay as single EN entries.
const FULLY_TRANSLATED_SEO_SLUGS = ['alternative-to-myfitnesspal'];

// Slugs of SEO articles that exist only in English. Sitemap will list a single
// entry per slug without hreflang alternates.
const ENGLISH_ONLY_SEO_SLUGS = [
  'chat-calorie-tracker',
  'ai-food-journal',
  'calorie-tracking-without-stress',
  'calorie-tracker-eating-disorders',
  'no-dinner-ideas-calories',
  'how-to-stay-consistent-calorie-tracking',
  'photo-vs-chat-calorie-tracking',
];

function localizedPath(base: string, locale: string, path = ''): string {
  // Default locale (EN) is served without a prefix; other locales get /<locale>.
  // Root EN keeps its trailing slash (matches the site's canonical URL).
  if (locale === routing.defaultLocale) {
    return path === '' ? `${base}/` : `${base}${path}`;
  }
  return `${base}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
  const now = new Date();

  // Home page — all locales
  const homeLanguages: Record<string, string> = { 'x-default': `${base}/` };
  for (const loc of routing.locales) {
    homeLanguages[loc] = localizedPath(base, loc);
  }

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: homeLanguages },
    },
  ];

  // Fully translated SEO articles: hreflang alternates for each locale
  for (const slug of FULLY_TRANSLATED_SEO_SLUGS) {
    const languages: Record<string, string> = {
      'x-default': `${base}/${slug}`,
    };
    for (const loc of routing.locales) {
      languages[loc] = localizedPath(base, loc, `/${slug}`);
    }
    entries.push({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    });
  }

  // English-only SEO articles
  for (const slug of ENGLISH_ONLY_SEO_SLUGS) {
    entries.push({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: slug === 'alternative-to-myfitnesspal' ? 0.7 : 0.8,
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
