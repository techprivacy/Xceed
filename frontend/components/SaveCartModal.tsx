'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CartItem, cartItemsToOrderItems } from '@/lib/cart';
import { createSavedCart } from '@/lib/api';
import Button from '@/components/ui/Button';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20';

interface SaveCartModalProps {
  items: CartItem[];
  grandTotal: number;
  onClose: () => void;
}

export default function SaveCartModal({ items, grandTotal, onClose }: SaveCartModalProps) {
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await createSavedCart({
        items: cartItemsToOrderItems(items),
        grandTotal,
        name: form.name,
        email: form.email,
        mobileNumber: form.mobileNumber,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {status === 'success' ? (
          <div className="py-6 text-center">
            <p className="text-lg font-bold text-brand-black">Cart Saved!</p>
            <p className="mt-2 text-sm text-brand-slate">
              Thank you! Our team will contact you within 2 hours.
            </p>
            <Button onClick={onClose} className="mt-6">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-brand-black">Save Your Cart</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-brand-slate hover:bg-brand-mist"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mb-5 text-sm text-brand-slate">
              Leave your details and we&apos;ll keep this cart for you — our team will follow up shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full Name*"
                className={INPUT_CLASSES}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email Address*"
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

              <Button type="submit" disabled={status === 'submitting'} variant="primary" className="w-full">
                {status === 'submitting' ? 'Saving...' : 'Save Cart'}
              </Button>

              {status === 'error' && <p className="text-sm font-medium text-red-600">{errorMsg}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
