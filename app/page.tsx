import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CategoriesSection from '@/components/CategoriesSection';
import IndustriesSection from '@/components/IndustriesSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <TrustBar />
      <CategoriesSection />
      <IndustriesSection />
      <WhyChooseSection />
      <Footer />
    </main>
  );
}
