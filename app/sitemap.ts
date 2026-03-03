import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.pryvus.com';
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },

    // SEO Content Pages
    {
      url: `${base}/chat-calorie-tracker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/ai-food-journal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/calorie-tracking-without-stress`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/alternative-to-myfitnesspal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    },

    // Legal Pages
    {
      url: `${base}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${base}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${base}/legal/ai-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
  ];
}
