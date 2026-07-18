import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>>['data'] = [];
  try {
    const res = await getProducts({ limit: 100 });
    products = res.data;
  } catch {
    // Backend unreachable — render an empty state rather than crashing the page
  }

  return (
    <main>
      <SiteHeader />

      <section className="bg-brand-mist py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow="Catalog"
            title="All Products"
            subtitle="Japanese-quality cast letters, numbers, holders and marking tools for industrial use."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((c) => (
              <Link
                key={c.urlSlug}
                href={`/${c.urlSlug}`}
                className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x">
          {products.length === 0 ? (
            <p className="rounded-2xl border border-black/5 bg-brand-mist p-8 text-center text-sm text-brand-slate">
              No products listed yet — check back soon, or{' '}
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
