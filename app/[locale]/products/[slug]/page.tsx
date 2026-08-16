import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import JsonLd from '@/components/seo/JsonLd';
import { getProductBySlug } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';
import { buildMetadata, noIndexMetadata, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const res = await getProductBySlug(params.slug);
    const product = res.data;
    if (!product) return noIndexMetadata('Product Not Found');
    return buildMetadata({
      title: product.name,
      description: product.shortDescription || product.description || `${product.name} — precision industrial marking from XCEED.`,
      path: `/products/${product.slug}`,
      image: product.images?.[0],
    });
  } catch {
    return noIndexMetadata('Product Not Found');
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  let product;
  try {
    const res = await getProductBySlug(params.slug);
    product = res.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  const categoryName = typeof product.category === 'string' ? undefined : product.category?.name;
  // Backend Category.slug ("magnetic-tool") can differ from the actual
  // route slug ("magnetic-tools") — go through PRODUCT_CATEGORIES for the
  // real URL rather than linking to a 404.
  const rawCategorySlug = typeof product.category === 'string' ? undefined : product.category?.slug;
  const categorySlug = PRODUCT_CATEGORIES.find((c) => c.apiSlug === rawCategorySlug)?.urlSlug;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images?.map((img) => (img.startsWith('http') ? img : absoluteUrl(img))),
    sku: product._id,
    brand: { '@type': 'Brand', name: 'XCEED' },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: product.currency || 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    ...(categoryName && categorySlug ? [{ name: categoryName, path: `/${categorySlug}` }] : []),
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={[productJsonLd, breadcrumb]} />
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
