export interface CartItem {
  id: string;
  kind: 'letters' | 'numbers' | 'holder' | 'product';
  quantity: number;
  total: number;

  // Cast Letters / Cast Numbers / Holder configurator (optional — not used by catalog products)
  size?: string;
  type?: 'CONVEX' | 'CONCAVE';
  letters?: string[];
  letterCount?: number;
  pricePerLetter?: number;

  // Holder-configurator specific
  shape?: 'SQUARE' | 'OVAL';
  installation?: 'GLUE' | 'SCREW';
  capacity?: number;
  holderPrice?: number;
  gst?: number;

  // Generic catalog product (kind: 'product')
  productId?: string;
  name?: string;
  slug?: string;
  image?: string;
  price?: number;
}

const STORAGE_KEY = 'xceed_cart';
export const CART_UPDATED_EVENT = 'xceed-cart-updated';

function read(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function getCart(): CartItem[] {
  return read();
}

export function addToCart(item: Omit<CartItem, 'id'>): CartItem[] {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const updated = [...read(), { ...item, id }];
  write(updated);
  return updated;
}

export function removeFromCart(id: string): CartItem[] {
  const updated = read().filter((item) => item.id !== id);
  write(updated);
  return updated;
}

export function getCartCount(): number {
  return read().length;
}

export function getCartTotal(): number {
  return read().reduce((sum, item) => sum + item.total, 0);
}

export function clearCart(): void {
  write([]);
}

// Human-readable line description, shared between the cart page display and
// the order/saved-cart snapshot sent to the backend (which has no idea what a
// "holder configurator" is — it just stores whatever name it's given).
export function describeCartItem(item: CartItem): string {
  if (item.kind === 'product') return item.name ?? 'Product';
  const kindLabel =
    item.kind === 'holder' ? 'Holder Configuration' : item.kind === 'numbers' ? 'Cast Numbers' : 'Cast Letters';
  const parts = [item.size, item.type].filter(Boolean);
  return parts.length ? `${kindLabel} — ${parts.join(' · ')}` : kindLabel;
}

// Strips each cart line down to the {kind, name, quantity, total, image,
// details} shape both /api/orders and /api/saved-carts expect — everything
// configurator-specific (letters, capacity, installation...) rides along in
// `details` purely for the admin view, never re-parsed by the frontend.
export function cartItemsToOrderItems(items: CartItem[]) {
  return items.map(({ id, kind, quantity, total, image, productId, ...details }) => ({
    kind,
    name: describeCartItem({ id, kind, quantity, total, image, productId, ...details } as CartItem),
    quantity,
    total,
    ...(kind === 'product' ? { productId, image } : {}),
    details,
  }));
}
