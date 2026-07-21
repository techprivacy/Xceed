import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getLiveTheme, themeToCssVars, DEFAULT_THEME } from '@/lib/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'XCEED India | Precision Marking Solutions',
  description:
    'Japanese-quality industrial cast letters, numbers, holders and marking tools for manufacturing, steel, fabrication and engineering industries.',
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
      <body className={`${inter.variable} font-sans bg-white`}>{children}</body>
    </html>
  );
}
