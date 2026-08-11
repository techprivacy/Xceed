'use client';

import { useEffect, useState } from 'react';
import { getCartCount, CART_UPDATED_EVENT } from './cart';

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const handler = () => setCount(getCartCount());
    window.addEventListener(CART_UPDATED_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return count;
}
