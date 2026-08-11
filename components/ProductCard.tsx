import Image from 'next/image';
import { Product } from '@/types';
import Card from '@/components/ui/Card';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';
import { productHref, productImage, needsContain, isConfiguratorProduct } from '@/lib/productDisplay';

export default function ProductCard({ product }: { product: Partial<Product> }) {
  const image = productImage(product);
  const href = productHref(product);

  return (
    <Card accent className="group p-4 hover:shadow-md">
      <div
        className={`relative mb-4 h-28 w-full overflow-hidden rounded-xl ${
          needsContain(image) ? 'bg-white' : 'bg-brand-mist'
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name ?? ''}
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            className={`transition-transform duration-500 group-hover:scale-105 ${
              needsContain(image) ? 'object-contain p-2' : 'object-cover'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ProductImagePlaceholder />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-brand-black">{product.name}</h3>
      <p className="mt-1 text-xs text-brand-slate">{product.shortDescription}</p>
      <a
        href={href}
        className="mt-3 inline-block text-xs font-semibold text-brand-red hover:text-brand-redDark"
      >
        {isConfiguratorProduct(product) ? 'Configure →' : 'View Details →'}
      </a>
    </Card>
  );
}
