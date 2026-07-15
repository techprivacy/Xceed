import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'XCEED India | Precision Marking Solutions',
  description:
    'Japanese-quality industrial cast letters, numbers, holders and marking tools for manufacturing, steel, fabrication and engineering industries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white`}>{children}</body>
    </html>
  );
}
