import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export default function middleware(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  let resolvedLocale: (typeof routing.locales)[number];

  if (saved === 'en' || saved === 'ja') {
    // Priority 1: a saved preference — whether it was set by geo-detection on a
    // previous visit or a manual switch, it's sticky forever from here on.
    resolvedLocale = saved;
  } else {
    // Priority 2: Vercel's built-in geo header (free, no API key). Absent in
    // local dev, which correctly falls through to English.
    const country = request.headers.get('x-vercel-ip-country');
    resolvedLocale = country === 'JP' ? 'ja' : 'en'; // Priority 3: default (covers IN + everything else)
  }

  const handleI18nRouting = createMiddleware({ ...routing, defaultLocale: resolvedLocale });
  const response = handleI18nRouting(request);

  if (!saved) {
    // First visit only: persist so geo-detection never runs again for this browser.
    response.cookies.set(LOCALE_COOKIE, resolvedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
