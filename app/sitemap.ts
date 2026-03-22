import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuvvoo.app';
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
    {
      url: `${base}/calorie-tracker-eating-disorders`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/no-dinner-ideas-calories`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/how-to-stay-consistent-calorie-tracking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/photo-vs-chat-calorie-tracking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
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
