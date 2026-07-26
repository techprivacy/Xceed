import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';
import AddToCartBox from '@/components/AddToCartBox';
import { getAssetUrl } from '@/lib/api';
import { unitLabel, formatINR } from '@/lib/format';
import { Category, Product } from '@/types';

// `bare` drops the component's own container/padding so a caller can place it
// inside an existing card shell (see the Magnetic Tools category page).
export default function ProductDetail({
  product,
  bare = false,
}: {
  product: Product;
  bare?: boolean;
}) {
  const category = typeof product.category === 'object' ? (product.category as Category) : null;
  const images = product.images?.length ? product.images : [];

  return (
    <section className={bare ? '' : 'container-x py-10'}>
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

          <AddToCartBox
            productId={product._id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={images[0] ? getAssetUrl(images[0]) : undefined}
          />
        </div>
      </div>
    </section>
  );
}
