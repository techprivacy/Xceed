'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';
import { CartItem, getCart, removeFromCart, CART_UPDATED_EVENT } from '@/lib/cart';
import { formatINR } from '@/lib/format';
import CheckoutModal from '@/components/CheckoutModal';
import SaveCartModal from '@/components/SaveCartModal';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSaveCart, setShowSaveCart] = useState(false);

  useEffect(() => {
    const load = () => setItems(getCart());
    load();
    window.addEventListener(CART_UPDATED_EVENT, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, load);
      window.removeEventListener('storage', load);
    };
  }, []);

  const handleRemove = (id: string) => {
    setItems(removeFromCart(id));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
  const gstTotal = items.reduce((sum, item) => sum + (item.gst ?? 0), 0);
  const subtotal = grandTotal - gstTotal;

  return (
    <main>
      <Header />

      <section className="bg-white py-14">
        <div className="container-x">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-brand-black sm:text-3xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-brand-mist p-10 text-center">
            <ShoppingCart className="mx-auto mb-4 text-brand-slate" size={40} />
            <p className="mb-5 text-sm text-brand-slate">Your cart is empty.</p>
            <Button href="/cast-letters" size="sm">
              Build Casting Letters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-brand-red/15 bg-white p-6 shadow-sm transition-colors hover:border-brand-red/30 sm:p-7"
                >
                  {item.kind === 'product' ? (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-5">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-mist sm:h-28 sm:w-28">
                          {item.image ? (
                            <Image src={item.image} alt={item.name ?? ''} fill sizes="112px" className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ProductImagePlaceholder size={36} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-brand-black">{item.name}</p>
                          <p className="mt-1.5 text-sm text-brand-slate">
                            {formatINR(item.price ?? 0)} × Qty {item.quantity}
                          </p>
                          <p className="mt-1 text-sm text-brand-slate">Incl. GST {formatINR(item.gst ?? 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start">
                        <p className="text-2xl font-bold text-brand-black">{formatINR(item.total)}</p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-sm font-semibold text-brand-red hover:underline sm:mt-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-bold text-brand-black">
                          {item.kind === 'holder'
                            ? 'Holder Configuration'
                            : item.kind === 'numbers'
                              ? 'Cast Numbers'
                              : 'Cast Letters'}{' '}
                          — {item.size} · {item.type}
                        </p>
                        <p className="mt-1.5 text-sm text-brand-slate">
                          {item.kind === 'numbers' ? 'Numbers' : 'Letters'}: {item.letters?.join(', ')} ({item.letterCount})
                        </p>
                        {item.kind === 'holder' ? (
                          <>
                            <p className="mt-1 text-sm text-brand-slate">
                              {item.shape === 'OVAL' ? 'Oval' : 'Square'} Holder · {item.installation === 'SCREW' ? 'Screw' : 'Glue'} Type
                              · Capacity {item.capacity}
                            </p>
                            <p className="mt-1 text-sm text-brand-slate">
                              Letters {formatINR((item.pricePerLetter ?? 0) * (item.letterCount ?? 0))} + Holders{' '}
                              {formatINR(item.holderPrice ?? 0)} + GST {formatINR(item.gst ?? 0)} × Qty {item.quantity}
                            </p>
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-brand-slate">
                            {formatINR(item.pricePerLetter ?? 0)} / {item.kind === 'numbers' ? 'number' : 'letter'} × Qty {item.quantity}{' '}
                            · Incl. GST {formatINR(item.gst ?? 0)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start">
                        <p className="text-2xl font-bold text-brand-black">{formatINR(item.total)}</p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-sm font-semibold text-brand-red hover:underline sm:mt-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Card className="h-fit p-6">
              <div className="flex justify-between text-sm text-brand-slate">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-sm text-brand-slate">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-brand-slate">
                <span>GST (18%)</span>
                <span>{formatINR(gstTotal)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-bold text-brand-black">
                <span>Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
              <Button onClick={() => setShowCheckout(true)} className="mt-6 w-full">
                Place Order
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowSaveCart(true)}
                className="mt-3 w-full"
              >
                Save Cart
              </Button>
            </Card>
          </div>
        )}
        </div>
      </section>

      <Footer />

      {showCheckout && (
        <CheckoutModal
          items={items}
          subtotal={subtotal}
          gstTotal={gstTotal}
          grandTotal={grandTotal}
          onClose={() => setShowCheckout(false)}
          onPlaced={() => setItems([])}
        />
      )}
      {showSaveCart && (
        <SaveCartModal items={items} grandTotal={grandTotal} onClose={() => setShowSaveCart(false)} />
      )}
    </main>
  );
}
