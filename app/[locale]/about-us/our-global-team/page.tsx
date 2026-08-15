import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Our Global Team',
};

export default function OurGlobalTeamPage() {
  return (
    <main>
      <Header />
      <ComingSoon
        icon={Users}
        title="Our Global Team is coming soon"
        message="Profiles of XCEED's team across Japan and India are on the way. In the meantime, our sales team is happy to help directly."
        ctaLabel="Contact Us"
        ctaHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
