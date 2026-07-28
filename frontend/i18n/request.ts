import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Grows as each i18n phase adds a namespace + its en/ja JSON files under messages/.
const NAMESPACES = ['common'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default] as const)
  );

  return { locale, messages: Object.fromEntries(entries) };
});
