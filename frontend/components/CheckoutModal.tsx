'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CartItem, cartItemsToOrderItems, clearCart } from '@/lib/cart';
import { createOrder } from '@/lib/api';
import { formatINR } from '@/lib/format';
import Button from '@/components/ui/Button';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const EMPTY_FORM = {
  customerName: '',
  companyName: '',
  email: '',
  mobileNumber: '',
  address: '',
  city: '',
  state: '',
  notes: '',
};

interface CheckoutModalProps {
  items: CartItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  onClose: () => void;
  onPlaced: () => void;
}

export default function CheckoutModal({ items, subtotal, gstTotal, grandTotal, onClose, onPlaced }: CheckoutModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await createOrder({
        items: cartItemsToOrderItems(items),
        subtotal,
        gstTotal,
        grandTotal,
        customerName: form.customerName,
        companyName: form.companyName || undefined,
        email: form.email || undefined,
        mobileNumber: form.mobileNumber,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        notes: form.notes || undefined,
        source: 'Cart Checkout',
      });
      clearCart();
      setStatus('success');
      onPlaced();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {status === 'success' ? (
          <div className="py-6 text-center">
            <p className="text-lg font-bold text-brand-black">Order Placed!</p>
            <p className="mt-2 text-sm text-brand-slate">
              Thank you! Our team will contact you shortly to confirm your order.
            </p>
            <Button onClick={onClose} className="mt-6">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-brand-black">Checkout</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-brand-slate hover:bg-brand-mist"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-brand-mist p-4 text-sm">
              <div className="flex justify-between text-brand-slate">
                <span>{items.length} item(s)</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-brand-slate">
                <span>GST</span>
                <span>{formatINR(gstTotal)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-black/5 pt-2 text-base font-bold text-brand-black">
                <span>Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                placeholder="Full Name*"
                className={INPUT_CLASSES}
              />
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className={INPUT_CLASSES}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={INPUT_CLASSES}
              />
              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                required
                placeholder="Mobile Number*"
                className={INPUT_CLASSES}
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className={INPUT_CLASSES}
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className={INPUT_CLASSES}
              />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Delivery Address"
                className={`${INPUT_CLASSES} resize-none sm:col-span-2`}
              />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Order Notes (optional)"
                className={`${INPUT_CLASSES} resize-none sm:col-span-2`}
              />

              <div className="sm:col-span-2">
                <Button type="submit" disabled={status === 'submitting'} variant="primary" className="w-full">
                  {status === 'submitting' ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>

              {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
