import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';
import { getProductBySlug, getAssetUrl } from '@/lib/api';
import { unitLabel, formatINR } from '@/lib/format';
import { Category } from '@/types';

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
      <SiteHeader />

      <section className="container-x py-10">
        <nav className="mb-6 text-xs text-brand-slate">
          <Link href="/" className="hover:text-brand-red">
            Home
          </Link>
          {category && (
            <>
              {' / '}
              <span>{category.name}</span>
            </>
          )}
          {' / '}
          <span className="text-brand-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-brand-mist">
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
                <div className="flex h-full items-center justify-center">
                  <ProductImagePlaceholder size={96} />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1).map((img) => (
                  <div key={img} className="relative aspect-square overflow-hidden rounded-xl bg-brand-mist">
                    <Image src={getAssetUrl(img)} alt={product.name} fill sizes="150px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.isBestSeller && (
              <Badge tone="red" className="mb-3">
                Best Seller
              </Badge>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-brand-black sm:text-3xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-brand-slate">{product.shortDescription}</p>
            )}

            <p className="mt-5 text-3xl font-bold tracking-tight text-brand-black">
              {formatINR(product.price)}{' '}
              <span className="text-base font-medium text-brand-slate">{unitLabel(product.priceUnit)}</span>
            </p>

            <ul className="mt-5 space-y-2 text-sm text-brand-charcoal">
              <li>
                Minimum order: {product.minOrderQty} {unitLabel(product.priceUnit) || 'pcs'}
              </li>
              <li>{product.inStock ? '✓ In Stock' : '✕ Out of Stock'}</li>
              {category && <li>Category: {category.name}</li>}
            </ul>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {product.description && (
              <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-brand-charcoal">
                {product.description}
              </div>
            )}

            <Button href="/#quote-form" size="sm" className="mt-8">
              Request Custom Quote →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
