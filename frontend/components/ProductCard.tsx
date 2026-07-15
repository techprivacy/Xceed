import Image from 'next/image';
import { Product } from '@/types';
import { getAssetUrl } from '@/lib/api';

const unitLabel: Record<string, string> = {
  per_letter: 'per letter',
  per_piece: '',
  per_set: 'per set',
};

export default function ProductCard({ product }: { product: Partial<Product> }) {
  const image = getAssetUrl(product.images?.[0]);

  return (
    <div className="group rounded-xl border border-brand-border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-xl">
      <div className="relative mb-4 h-28 w-full overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={product.name ?? ''}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400"
          >
            <rect x="8" y="20" width="48" height="24" rx="3" fill="currentColor" opacity="0.5" />
            <rect x="16" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
            <rect x="36" y="8" width="12" height="16" rx="2" fill="currentColor" opacity="0.8" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-bold text-brand-blue">{product.name}</h3>
      <p className="mt-1 text-xs text-gray-500">{product.shortDescription}</p>
      <p className="mt-3 text-sm text-gray-700">
        Starting from{' '}
        <span className="font-bold text-brand-black">
          ₹{product.price?.toLocaleString('en-IN')}
        </span>{' '}
        {product.priceUnit ? unitLabel[product.priceUnit] : ''}
      </p>
      <a
        href={`/products/${product.slug}`}
        className="mt-2 inline-block text-xs font-semibold text-brand-blue hover:text-brand-blueDarker hover:underline"
      >
        View Details →
      </a>
    </div>
  );
}
