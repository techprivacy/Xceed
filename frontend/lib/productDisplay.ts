import { Category, ConfiguratorType, Product } from '@/types';
import { getAssetUrl } from '@/lib/api';

// Cast Letters / Cast Numbers / Holders each exist in the catalogue as a single
// admin-managed record that only carries the configurator's pricing. Linking
// those to /products/<slug> dead-ends on a stub detail page that sells one
// nominal unit and bypasses the builder entirely, so they route to their
// configurator instead.
const CONFIGURATOR_ROUTES: Partial<Record<ConfiguratorType, string>> = {
  cast_letters: '/cast-letters',
  cast_numbers: '/cast-numbers',
  holder: '/holders',
};

export function productHref(product: Partial<Product>): string {
  const configuratorRoute = product.configuratorType
    ? CONFIGURATOR_ROUTES[product.configuratorType]
    : undefined;
  return configuratorRoute ?? `/products/${product.slug}`;
}

export const isConfiguratorProduct = (product: Partial<Product>): boolean =>
  Boolean(product.configuratorType && CONFIGURATOR_ROUTES[product.configuratorType]);

// No catalogue record currently has an uploaded image, which left every card and
// detail page on the generic placeholder. Falling back to the category artwork
// in /public keeps the catalogue looking finished until images are uploaded via
// the admin panel — a real product image always wins.
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'cast-letters': '/cast_letter.png',
  'cast-numbers': '/cast_number.png',
  holders: '/cast_holder.png',
  // Matches the magnetic-tools artwork used on the homepage category card.
  'magnetic-tool': '/magtool.jpeg',
};

// Only the local catalogue shots need containing — they are wide products on a
// white backdrop. The magnetic-tools photo is a full-bleed 4:3 image and should
// still cover its frame.
const CONTAIN_IMAGES = ['/cast_letter.png', '/cast_number.png', '/cast_holder.png'];

export function productImage(product: Partial<Product>): string {
  const uploaded = getAssetUrl(product.images?.[0]);
  if (uploaded) return uploaded;

  const categorySlug =
    typeof product.category === 'object' ? (product.category as Category)?.slug : undefined;
  return (categorySlug && CATEGORY_FALLBACK_IMAGES[categorySlug]) || '';
}

export const needsContain = (src: string): boolean => CONTAIN_IMAGES.includes(src);
