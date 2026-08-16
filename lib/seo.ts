import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'XCEED';

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

interface BuildMetadataOptions {
  /** Page title — combined with the site name via the root layout's title.template. */
  title: string;
  /** Unique, ~150-160 char summary. Required — never falls back to the site-wide description. */
  description: string;
  /**
   * Canonical path, e.g. "/products" or "/cast-letters". Locale-neutral —
   * always points at the default-locale (unprefixed) URL, since the site's
   * / ja routes serve byte-identical English content (no translation
   * exists) and would otherwise read as duplicate content to search
   * engines. This is the single place that policy lives.
   */
  path: string;
  /** Absolute or root-relative image URL for social previews. Defaults to the logo. */
  image?: string;
  /** Set false for thin/utility/private pages that shouldn't be indexed. */
  index?: boolean;
  type?: 'website' | 'article';
}

/**
 * One shared place to build a page's <title>/<meta description>/canonical/
 * Open Graph/Twitter metadata, so those don't get hand-rolled (and drift
 * out of sync with each other) across dozens of page.tsx files.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = '/logo.png',
  index = true,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index, follow: true },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/** For pages with no unique indexable value (auth forms, dashboards, etc.). */
export function noIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string; // "" for the current/last item is fine — item.path only needs to resolve for ancestors
}

/** BreadcrumbList JSON-LD — pass the full trail including the current page. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
