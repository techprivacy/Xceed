import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopBar from '@/components/TopBar';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import { getProductBySlug, getAssetUrl } from '@/lib/api';
import { Category } from '@/types';

const unitLabel: Record<string, string> = {
  per_letter: 'per letter',
  per_piece: '',
  per_set: 'per set',
};

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    const res = await getProductBySlug(params.slug);
    product = res.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  const category = typeof product.category === 'object' ? (product.category as Category) : null;
  const images = product.images?.length ? product.images : [];

  return (
    <main>
      <TopBar />
      <SiteHeader />

      <section className="container-x py-10">
        <nav className="mb-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-brand-blue">
            Home
          </Link>
          {category && (
            <>
              {' / '}
              <span>{category.name}</span>
            </>
          )}
          {' / '}
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
              {images[0] ? (
                <Image
                  src={getAssetUrl(images[0])}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <svg width="96" height="96" viewBox="0 0 64 64">
                    <rect x="8" y="20" width="48" height="24" rx="3" fill="currentColor" opacity="0.5" />
                    <rect x="16" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
                    <rect x="36" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1).map((img) => (
                  <div key={img} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image src={getAssetUrl(img)} alt={product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.isBestSeller && (
              <span className="mb-3 inline-block rounded bg-brand-red px-2.5 py-1 text-xs font-bold uppercase text-white">
                Best Seller
              </span>
            )}
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-gray-500">{product.shortDescription}</p>
            )}

            <p className="mt-5 text-3xl font-extrabold text-brand-black">
              ₹{product.price.toLocaleString('en-IN')}{' '}
              <span className="text-base font-medium text-gray-500">
                {unitLabel[product.priceUnit]}
              </span>
            </p>

            <ul className="mt-5 space-y-2 text-sm text-gray-700">
              <li>Minimum order: {product.minOrderQty} {unitLabel[product.priceUnit] || 'pcs'}</li>
              <li>{product.inStock ? '✓ In Stock' : '✕ Out of Stock'}</li>
              {category && <li>Category: {category.name}</li>}
            </ul>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {product.description && (
              <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {product.description}
              </div>
            )}

            <Link
              href="/#quote-form"
              className="mt-8 inline-block rounded bg-brand-red px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-redDark"
            >
              Request Custom Quote →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
