import type { MetadataRoute } from 'next';

const SITE_URL = 'https://scan-my-prompt.vercel.app';

const alternates = (path: string) => ({
  languages: {
    en: `${SITE_URL}${path}`,
    fr: `${SITE_URL}${path}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: alternates('/'),
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: alternates('/about'),
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: alternates('/contact'),
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: alternates('/terms'),
    },
  ];
}
