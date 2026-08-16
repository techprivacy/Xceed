import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Industrial Marking Products',
  description:
    'Cast letters, cast numbers, holders and magnetic marking tools — Japanese-quality industrial identification products for steel, foundry, and manufacturing use.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <main>
      <Header />

      <section className="bg-white py-14">
        <div className="container-x">
          <SectionHeading title="Our Products" size="h1" className="mb-10" />
          <ProductCategoryGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
