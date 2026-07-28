import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './globals.css';
import { getLiveTheme, themeToCssVars, DEFAULT_THEME } from '@/lib/theme';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_TITLE = 'XCEED India | Precision Marking Solutions';
const SITE_DESCRIPTION =
  'Japanese-quality industrial cast letters, numbers, holders and marking tools for manufacturing, steel, foundry, fabrication and engineering industries.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | XCEED India',
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.png',
  },
  keywords: [
    'cast letters',
    'cast numbers',
    'marking holders',
    'magnetic marking tools',
    'industrial marking solutions',
    'steel stamps India',
    'foundry marking tools',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'XCEED India',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: '/logo.png', width: 280, height: 126, alt: 'XCEED India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const [theme, messages] = await Promise.all([
    getLiveTheme()
      .then((res) => res.data)
      .catch(() => DEFAULT_THEME),
    getMessages(),
  ]);

  return (
    <html lang={locale}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCssVars(theme) }} />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
