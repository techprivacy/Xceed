import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const STATIC_ROUTES = [
  '',
  '/products',
  '/industries',
  '/directory',
  '/membership/register',
  '/contact-us',
  '/track-order',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryRoutes = PRODUCT_CATEGORIES.map((c) => `/${c.urlSlug}`);

  return [...STATIC_ROUTES, ...categoryRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
