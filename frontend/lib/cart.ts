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
