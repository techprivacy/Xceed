import type { Metadata } from 'next';
import './globals.css';
import { getLiveTheme, themeToCssVars, DEFAULT_THEME } from '@/lib/theme';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getLiveTheme()
    .then((res) => res.data)
    .catch(() => DEFAULT_THEME);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCssVars(theme) }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
