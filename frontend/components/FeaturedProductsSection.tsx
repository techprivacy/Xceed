import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCategoryGrid from '@/components/ProductCategoryGrid';

export default function FeaturedProductsSection() {
  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Our Products" />
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-red hover:text-brand-redDark"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>

        <ProductCategoryGrid />
      </div>
    </section>
  );
}
