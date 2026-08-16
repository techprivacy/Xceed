import type { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES, INDUSTRIES } from '@/lib/staticData';
import { getNewsArticles, getProducts } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Static, always-indexable routes. Locale-neutral (default/English-only
// URLs) — the /ja/* variants serve byte-identical content (no translation
// exists), so they're intentionally left out of the sitemap and every
// page's canonical points back to these same paths, per lib/seo.ts.
// Excludes: /admin/* (noindex, see app/robots.ts), private member-portal
// pages, /login, /cart, /account, /verify-email, /reset-password (all
// noindex/blocked), and pure redirect stubs (/about-us, /membership,
// /about-us/director-message, /member/login) which have nothing of their
// own to index — and /member/directory, which canonicalizes to /directory.
const STATIC_ROUTES = [
  '',
  '/products',
  '/industries',
  '/about-us/president-message',
  '/about-us/our-global-team',
  '/about-us/news-awards',
  '/about-us/news-awards/all',
  '/directory',
  '/contact-us',
  '/membership/register',
  '/member/register',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/track-order',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryRoutes = PRODUCT_CATEGORIES.map((c) => `/${c.urlSlug}`);
  const industryRoutes = INDUSTRIES.map((i) => `/industries/${i.urlSlug}`);

  // Both fetches are best-effort: if the backend is unreachable at build
  // time, the sitemap still emits every static route rather than failing
  // outright.
  const [newsSlugs, productSlugs] = await Promise.all([
    getNewsArticles({ limit: 200 })
      .then((res) => res.data.map((a) => `/about-us/news-awards/${a.slug}`))
      .catch(() => []),
    getProducts({ limit: 500 })
      .then((res) => res.data.map((p) => `/products/${p.slug}`))
      .catch(() => []),
  ]);

  const allPaths = [...STATIC_ROUTES, ...categoryRoutes, ...industryRoutes, ...newsSlugs, ...productSlugs];

  return allPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
