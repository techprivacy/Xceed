import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'News & Awards',
};

export default function NewsAwardsPage() {
  return (
    <main>
      <Header />
      <ComingSoon
        icon={Newspaper}
        title="News & Awards is coming soon"
        message="Company news, recognitions and industry awards are on the way. In the meantime, our sales team is happy to help directly."
        ctaLabel="Contact Us"
        ctaHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
