'use client';

import { addToCart } from '@/lib/cart';
import Button from '@/components/ui/Button';
import { useTimedFeedback } from '@/lib/useTimedFeedback';
import { useQuantity } from '@/lib/useQuantity';
import { calculateGst } from '@/lib/tax';
import { formatINR } from '@/lib/format';

interface AddToCartBoxProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
}

export default function AddToCartBox({ productId, slug, name, price, image }: AddToCartBoxProps) {
  const { quantity, increment, decrement } = useQuantity();
  const { feedback, showFeedback } = useTimedFeedback();

  const subtotal = price * quantity;
  const gst = calculateGst(subtotal);
  const total = subtotal + gst;

  const handleAddToCart = () => {
    addToCart({
      kind: 'product',
      productId,
      slug,
      name,
      image,
      price,
      quantity,
      total,
      gst,
    });
    showFeedback('success', `Added ${quantity} to cart!`);
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-semibold text-brand-charcoal">Quantity</span>
        <div className="flex items-center gap-3 rounded-full border border-brand-border px-3 py-1.5">
          <button
            type="button"
            onClick={decrement}
            className="text-brand-charcoal transition-colors hover:text-brand-red"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-6 text-center text-sm font-semibold text-brand-black">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            className="text-brand-charcoal transition-colors hover:text-brand-red"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-1 text-xs text-brand-slate">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>{formatINR(gst)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-brand-black">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>

      {feedback && (
        <p
          className={`mb-4 text-sm font-semibold ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
        >
          {feedback.text}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={handleAddToCart} size="sm">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
