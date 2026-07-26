import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

// The catalogue shots are wide (2:1–2.7:1) product photography on a white
// backdrop, so they are contained rather than cropped — object-cover in a 4:3
// frame would slice the outer characters clean off. The magnetic-tools photo is
// already 4:3, so it fills the same frame edge to edge.
const CATEGORY_IMAGES: Record<string, { src: string; contain: boolean }> = {
  'cast-letters': { src: '/cast_letter.png', contain: true },
  'cast-numbers': { src: '/cast_number.png', contain: true },
  holders: { src: '/cast_holder.png', contain: true },
  'magnetic-tools': {
    src: 'https://images.unsplash.com/photo-1529479627062-5f1f0b88912a?w=800&h=600&fit=crop',
    contain: false,
  },
};

const CATEGORIES = ['cast-letters', 'cast-numbers', 'holders', 'magnetic-tools'].map(
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
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                <Image
                  src={CATEGORY_IMAGES[cat.urlSlug].src}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    CATEGORY_IMAGES[cat.urlSlug].contain ? 'object-contain p-5' : 'object-cover'
                  }`}
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
