import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import IndustriesSection from '@/components/IndustriesSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import Footer from '@/components/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XCEED',
  url: absoluteUrl('/'),
  logo: absoluteUrl('/logo.png'),
  description:
    'Japanese-quality industrial cast letters, numbers, holders and marking tools for manufacturing, steel, foundry, fabrication and engineering industries.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-95375-11777',
    contactType: 'sales',
    email: 'info@xceedindia.com',
  },
  sameAs: ['https://www.instagram.com/xceed_india', 'https://www.linkedin.com/company/xceedindia'],
};

export default function HomePage() {
  return (
    <main>
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <Header />
      <Hero />
      <TrustBar />
      <FeaturedProductsSection />
      <IndustriesSection />
      <WhyChooseSection />
      <Footer />
    </main>
  );
}
