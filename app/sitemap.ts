import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/legal/privacy`, lastModified: new Date() },
    { url: `${base}/legal/terms`, lastModified: new Date() },
    { url: `${base}/legal/ai-disclosure`, lastModified: new Date() },
  ];
}
