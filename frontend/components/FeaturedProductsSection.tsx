import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const HOMEPAGE_CATEGORY_SLUGS = ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'];

const CATEGORY_IMAGES: Record<string, string> = {
  'cast-letters': 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=800&h=600&fit=crop',
  'cast-numbers': 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=800&h=600&fit=crop',
  holders: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
  'magnetic-tools': 'https://images.unsplash.com/photo-1529479627062-5f1f0b88912a?w=800&h=600&fit=crop',
};

const CATEGORIES = HOMEPAGE_CATEGORY_SLUGS.map(
  (slug) => PRODUCT_CATEGORIES.find((c) => c.urlSlug === slug)!
);

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.urlSlug}
              href={`/${cat.urlSlug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_12px_32px_-24px_rgba(7,28,58,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-red/20 hover:shadow-[0_24px_44px_-28px_rgba(7,28,58,0.36)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-mist">
                <Image
                  src={CATEGORY_IMAGES[cat.urlSlug]}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide text-brand-black">
                  {cat.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-slate">
                  {cat.description}
                </p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-red">
                  View Products
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
