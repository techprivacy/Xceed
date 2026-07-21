import Image from 'next/image';
import { Product } from '@/types';
import { getAssetUrl } from '@/lib/api';
import { unitLabel, formatINR } from '@/lib/format';
import Card from '@/components/ui/Card';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';

export default function ProductCard({ product }: { product: Partial<Product> }) {
  const image = getAssetUrl(product.images?.[0]);

  return (
    <Card accent className="group p-4 hover:shadow-md">
      <div className="relative mb-4 h-28 w-full overflow-hidden rounded-xl bg-brand-mist">
        {image ? (
          <Image
            src={image}
            alt={product.name ?? ''}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ProductImagePlaceholder />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-brand-black">{product.name}</h3>
      <p className="mt-1 text-xs text-brand-slate">{product.shortDescription}</p>
      <p className="mt-3 text-sm text-brand-slate">
        Starting from <span className="font-semibold text-brand-black">{formatINR(product.price ?? 0)}</span>{' '}
        {unitLabel(product.priceUnit)}
      </p>
      <a
        href={`/products/${product.slug}`}
        className="mt-2 inline-block text-xs font-semibold text-brand-red hover:text-brand-redDark"
      >
        View Details →
      </a>
    </Card>
  );
}
