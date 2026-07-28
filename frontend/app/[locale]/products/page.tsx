import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';

export default function ProductsPage() {
  return (
    <main>
      <Header />

      <section className="bg-white py-14">
        <div className="container-x">
          <SectionHeading title="Our Products" className="mb-10" />
          <ProductCategoryGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
