import { Building2 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';

export default function DealerLoginPage() {
  return (
    <main>
      <SiteHeader />
      <ComingSoon
        icon={Building2}
        title="The dealer portal is launching soon"
        message="Self-service dealer accounts with pricing and order tracking are on the way. For dealer pricing today, reach out to our sales team directly."
        ctaLabel="Contact Us"
        ctaHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
