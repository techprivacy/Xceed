import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import { getProductBySlug } from '@/lib/api';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product;
  try {
    const res = await getProductBySlug(params.slug);
    product = res.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <main>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
