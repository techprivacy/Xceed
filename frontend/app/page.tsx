import TopBar from '@/components/TopBar';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import TrendingSection from '@/components/TrendingSection';
import IndustriesSection from '@/components/IndustriesSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import QuoteFormSection from '@/components/QuoteFormSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <TopBar />
      <SiteHeader />
      <Hero />
      <TrustBar />
      <TrendingSection />
      <IndustriesSection />
      <WhyChooseSection />
      <QuoteFormSection />
      <Footer />
    </main>
  );
}
