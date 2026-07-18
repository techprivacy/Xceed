import { getTrendingProducts } from '@/lib/api';
import { FALLBACK_TRENDING } from '@/lib/staticData';
import ProductCard from './ProductCard';
import { Product } from '@/types';

export default async function TrendingSection() {
  let products: Partial<Product>[] = FALLBACK_TRENDING;

  try {
    const res = await getTrendingProducts();
    if (res?.data?.length) products = res.data;
  } catch {
    // Backend not reachable yet — fall back to static demo data
  }

  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
