import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import IndustriesSection from '@/components/IndustriesSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XCEED',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
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
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
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
