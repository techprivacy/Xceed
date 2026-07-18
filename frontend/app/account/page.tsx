import { User } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';

export default function AccountPage() {
  return (
    <main>
      <SiteHeader />
      <ComingSoon
        icon={User}
        title="Customer accounts are launching soon"
        message="Order history, saved addresses and repeat-order tools are on the way. In the meantime, our sales team is happy to help directly."
        ctaLabel="Contact Us"
        ctaHref="/contact-us"
      />
      <Footer />
    </main>
  );
}
