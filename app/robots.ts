import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin', // authenticated dashboard — no public content, zero search value
        '/api', // backend endpoints, not pages
        '/cart', // private, per-session
        '/login',
        '/account', // placeholder "coming soon" page, no content
        // Authenticated member-portal pages only — NOT the whole /member
        // prefix, since /member/register (Create Account) is a real public
        // page and /member/directory needs to stay crawlable so Google can
        // see its rel=canonical pointing at /directory (a disallowed page
        // can't have its canonical tag discovered at all).
        '/member/dashboard',
        '/member/profile',
        '/member/subscription',
        '/member/forgot-password',
        '/verify-email', // token-gated utility, no content without a token
        '/reset-password', // token-gated utility, no content without a token
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
