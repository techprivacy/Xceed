import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { getTrendingProducts } from '@/lib/api';
import { FALLBACK_TRENDING } from '@/lib/staticData';
import { Product } from '@/types';

export default async function FeaturedProductsSection() {
  let products: Partial<Product>[] = FALLBACK_TRENDING;
  try {
    const res = await getTrendingProducts();
    if (res.data?.length) products = res.data;
  } catch {
    // Backend unreachable — fall back to static demo products
  }

  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured"
            title="Trending Products"
            subtitle="Popular picks from our precision marking catalogue."
          />
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-red hover:text-brand-redDark"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id ?? product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
