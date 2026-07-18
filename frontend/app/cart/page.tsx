import { ShoppingCart } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';

export default function CartPage() {
  return (
    <main>
      <SiteHeader />
      <ComingSoon
        icon={ShoppingCart}
        title="Online ordering is launching soon"
        message="For now, our sales team handles orders directly so we can get your pricing and delivery details right. Browse products and request a quote — we'll take it from there."
        ctaLabel="Explore Products"
        ctaHref="/products"
      />
      <Footer />
    </main>
  );
}
