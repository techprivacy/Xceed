import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';

const CATEGORY_IMAGES: Record<string, string> = {
  'cast-letters': 'https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=500&h=380&fit=crop',
  'cast-numbers': 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=500&h=380&fit=crop',
  holders: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=380&fit=crop',
  'magnetic-tool': 'https://images.unsplash.com/photo-1529479627062-5f1f0b88912a?w=500&h=380&fit=crop',
  'custom-marking': 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&h=380&fit=crop',
};

export default function CategoriesSection() {
  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-brand-black sm:text-3xl">
            Our Product Categories
          </h2>
          <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-brand-red" />
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat) => {
            return (
              <Link
                key={cat.urlSlug}
                href={`/${cat.urlSlug}`}
                className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="relative h-36 w-full overflow-hidden bg-brand-charcoal">
                  <Image
                    src={CATEGORY_IMAGES[cat.apiSlug]}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="px-4 pb-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-brand-black">{cat.title}</h3>
                  <span className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-brand-red">
                    View Products
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
