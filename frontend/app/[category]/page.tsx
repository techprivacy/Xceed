import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import CastingCharacterBuilder from '@/components/CastingCharacterBuilder';
import HolderConfigurator from '@/components/HolderConfigurator';
import { getProducts } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';
import { ConfiguratorType, Product } from '@/types';

// Cast Letters / Cast Numbers / Holders each store their pricing on a single
// admin-managed product (Admin > Products, "Configurator" field) for that category.
async function getConfiguratorProduct(
  apiSlug: string,
  configuratorType: ConfiguratorType
): Promise<Product | undefined> {
  try {
    const res = await getProducts({ category: apiSlug, limit: 100 });
    // Only ever use a product explicitly flagged for this configurator — never fall
    // back to an arbitrary catalog item, since categories can hold plain products too.
    return res.data.find((p) => p.configuratorType === configuratorType);
  } catch {
    return undefined;
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const entry = PRODUCT_CATEGORIES.find((c) => c.urlSlug === params.category);
  if (!entry) notFound();

  if (entry.urlSlug === 'cast-letters') {
    const configurator = await getConfiguratorProduct(entry.apiSlug, 'cast_letters');
    return (
      <main>
        <Header />
        <CastingCharacterBuilder mode="letters" sizePricing={configurator?.sizePricing} />
        <Footer />
      </main>
    );
  }

  if (entry.urlSlug === 'cast-numbers') {
    const configurator = await getConfiguratorProduct(entry.apiSlug, 'cast_numbers');
    return (
      <main>
        <Header />
        <CastingCharacterBuilder mode="numbers" sizePricing={configurator?.sizePricing} />
        <Footer />
      </main>
    );
  }

  if (entry.urlSlug === 'holders') {
    const configurator = await getConfiguratorProduct(entry.apiSlug, 'holder');
    return (
      <main>
        <Header />
        <HolderConfigurator
          sizePricing={configurator?.sizePricing}
          holderPriceMatrix={configurator?.holderPriceMatrix}
        />
        <Footer />
      </main>
    );
  }

  if (entry.urlSlug === 'magnetic-tools') {
    let magneticProducts: Awaited<ReturnType<typeof getProducts>>['data'] = [];
    try {
      const res = await getProducts({ category: entry.apiSlug, limit: 1 });
      magneticProducts = res.data;
    } catch {
      // Backend unreachable — render an empty state rather than crashing the page
    }

    return (
      <main>
        <Header />
        {magneticProducts[0] ? (
          <ProductDetail product={magneticProducts[0]} />
        ) : (
          <section className="container-x py-14">
            <p className="rounded-2xl border border-black/5 bg-brand-mist p-8 text-center text-sm text-brand-slate">
              No products listed in this category yet — check back soon, or{' '}
              <a href="/contact-us" className="font-semibold text-brand-red hover:underline">
                request a custom quote
              </a>
              .
            </p>
          </section>
        )}
        <Footer />
      </main>
    );
  }

  let products: Awaited<ReturnType<typeof getProducts>>['data'] = [];
  try {
    const res = await getProducts({ category: entry.apiSlug, limit: 100 });
    products = res.data;
  } catch {
    // Backend unreachable — render an empty state rather than crashing the page
  }

  return (
    <main>
      <Header />

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
