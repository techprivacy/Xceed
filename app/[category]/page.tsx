import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const entry = PRODUCT_CATEGORIES.find((c) => c.urlSlug === params.category);
  if (!entry) notFound();

  let products: Awaited<ReturnType<typeof getProducts>>['data'] = [];
  try {
    const res = await getProducts({ category: entry.apiSlug, limit: 100 });
    products = res.data;
  } catch {
    // Backend unreachable — render an empty state rather than crashing the page
  }

  return (
    <main>
      <SiteHeader />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading eyebrow="Products" title={entry.title} subtitle={entry.description} />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          {products.length === 0 ? (
            <p className="rounded-2xl border border-black/5 bg-brand-mist p-8 text-center text-sm text-brand-slate">
              No products listed in this category yet — check back soon, or{' '}
              <a href="/contact-us" className="font-semibold text-brand-red hover:underline">
                request a custom quote
              </a>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
