import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './globals.css';
import { getLiveTheme, themeToCssVars, DEFAULT_THEME } from '@/lib/theme';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_TITLE = 'Japan–India Casting & Foundry Business Platform | XCEED India';
const SITE_DESCRIPTION =
  'XCEED India connects Japanese casting technology, foundry equipment, manufacturers and expertise with Indian foundries and industrial companies for sourcing, business development and partnerships.';

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
    'Japan India Casting',
    'Japan India Foundry',
    'Japan India Foundry Business',
    'Casting Industry India',
    'Foundry Industry India',
    'Japanese Foundry Technology',
    'Japanese Casting Technology',
    'Japanese Foundry Equipment',
    'Foundry Equipment India',
    'Casting Equipment India',
    'Casting Machinery India',
    'Foundry Machinery India',
    'Japanese Machinery India',
    'Japan India Business Partnership',
    'Japan India Business Platform',
    'Japan India Industrial Partnership',
    'Japan India Business Development',
    'Foundry Technology',
    'Casting Technology',
    'Metal Casting India',
    'Foundry Solutions India',
    'Casting Manufacturers India',
    'Indian Foundries',
    'Japanese Manufacturers India',
    'Japan India Industrial Trade',
    'Foundry Sourcing India',
    'Casting Sourcing India',
    'Foundry Automation',
    'Casting Automation',
    'Robotic Deburring',
    'Foundry Engineering',
    'Japanese Industrial Technology',
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
