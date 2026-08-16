'use client';

import { useMemo, useState } from 'react';
import { addToCart as addToCartStore } from '@/lib/cart';
import { useTimedFeedback } from '@/lib/useTimedFeedback';
import { useQuantity } from '@/lib/useQuantity';
import { calculateGst } from '@/lib/tax';
import { formatINR as formatINRRaw } from '@/lib/format';
import { HolderPriceMatrix, SizePrice } from '@/types';

type Size = '5mm' | '6mm' | '7mm' | '8mm';
type LetterType = 'CONVEX' | 'CONCAVE';
type Shape = 'SQUARE' | 'OVAL';
type Installation = 'GLUE' | 'SCREW';
type Capacity = 1 | 2 | 3 | 4;

const SIZES: Size[] = ['5mm', '6mm', '7mm', '8mm'];
const CAPACITIES: Capacity[] = [1, 2, 3, 4];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIGITS = '0123456789'.split('');

// Pricing reference: XCD INDIA (S) series — used as a fallback for any size
// the admin-configured product doesn't provide a price for
const DEFAULT_LETTER_PRICES: Record<Size, number> = {
  '5mm': 95,
  '6mm': 100,
  '7mm': 105,
  '8mm': 115,
};

const DEFAULT_HOLDER_PRICES: Record<Size, Record<Installation, Record<Capacity, number>>> = {
  '5mm': {
    GLUE: { 1: 3900, 2: 4800, 3: 5200, 4: 5700 },
    SCREW: { 1: 4000, 2: 5000, 3: 5300, 4: 5700 },
  },
  '6mm': {
    GLUE: { 1: 3950, 2: 4900, 3: 5350, 4: 5750 },
    SCREW: { 1: 4050, 2: 5100, 3: 5500, 4: 5850 },
  },
  '7mm': {
    GLUE: { 1: 4000, 2: 5100, 3: 5400, 4: 5850 },
    SCREW: { 1: 4050, 2: 5200, 3: 5600, 4: 5900 },
  },
  '8mm': {
    GLUE: { 1: 4050, 2: 5120, 3: 5420, 4: 5780 },
    SCREW: { 1: 4100, 2: 5300, 3: 5600, 4: 5960 },
  },
};

const formatINR = (amount: number) => formatINRRaw(Math.round(amount));

const optionCardClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
    active
      ? 'border-[#0A3D91] bg-[#0A3D91] text-white shadow-md shadow-[#0A3D91]/20'
      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0A3D91] hover:bg-blue-50'
  }`;

const keyButtonClass =
  'flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#0A3D91] hover:text-white hover:shadow-md';

interface HolderConfiguratorProps {
  sizePricing?: SizePrice[];
  holderPriceMatrix?: HolderPriceMatrix;
}

export default function HolderConfigurator({ sizePricing, holderPriceMatrix: holderPriceMatrixProp }: HolderConfiguratorProps) {
  const letterPrices = useMemo<Record<Size, number>>(() => {
    if (!sizePricing?.length) return DEFAULT_LETTER_PRICES;
    const merged = { ...DEFAULT_LETTER_PRICES };
    sizePricing.forEach(({ size: s, price }) => {
      if (SIZES.includes(s as Size)) merged[s as Size] = price;
    });
    return merged;
  }, [sizePricing]);

  const holderPrices = useMemo<Record<Size, Record<Installation, Record<Capacity, number>>>>(() => {
    if (!holderPriceMatrixProp) return DEFAULT_HOLDER_PRICES;
    const merged = { ...DEFAULT_HOLDER_PRICES };
    SIZES.forEach((s) => {
      const override = holderPriceMatrixProp[s];
      if (!override) return;
      merged[s] = {
        GLUE: { ...merged[s].GLUE, ...(override.GLUE as Partial<Record<Capacity, number>>) },
        SCREW: { ...merged[s].SCREW, ...(override.SCREW as Partial<Record<Capacity, number>>) },
      };
    });
    return merged;
  }, [holderPriceMatrixProp]);

  const [size, setSize] = useState<Size>('5mm');
  const [letterType, setLetterType] = useState<LetterType>('CONVEX');
  const [letters, setLetters] = useState<string[]>([]);
  const [shape, setShape] = useState<Shape>('SQUARE');
  const [installation, setInstallation] = useState<Installation>('GLUE');
  const [capacity, setCapacity] = useState<Capacity>(1);
  const { quantity, increment, decrement, setQuantity } = useQuantity();
  const { feedback, showFeedback, clearFeedback } = useTimedFeedback(2800);

  const addChar = (ch: string) => setLetters((prev) => [...prev, ch]);
  const removeCharAt = (index: number) => setLetters((prev) => prev.filter((_, i) => i !== index));

  const holders = useMemo(() => {
    const chunks: string[][] = [];
    for (let i = 0; i < letters.length; i += capacity) {
      const slice = letters.slice(i, i + capacity);
      while (slice.length < capacity) slice.push('');
      chunks.push(slice);
    }
    return chunks;
  }, [letters, capacity]);

  const pricePerLetter = letterPrices[size];
  const letterPrice = letters.length * pricePerLetter;
  const holderUnitPrice = holderPrices[size]?.[installation]?.[capacity] ?? 0;
  const holderCount = letters.length === 0 ? 0 : Math.ceil(letters.length / capacity);
  const holderPrice = holderCount * holderUnitPrice;
  const subtotal = (letterPrice + holderPrice) * quantity;
  const gst = calculateGst(subtotal);
  const grandTotal = subtotal + gst;

  const handleClear = () => {
    setSize('5mm');
    setLetterType('CONVEX');
    setLetters([]);
    setShape('SQUARE');
    setInstallation('GLUE');
    setCapacity(1);
    setQuantity(1);
    clearFeedback();
  };

  const buildCartPayload = () => ({
    kind: 'holder' as const,
    size,
    type: letterType,
    letters,
    letterCount: letters.length,
    pricePerLetter,
    quantity,
    total: grandTotal,
    shape,
    installation,
    capacity,
    holderPrice,
    gst,
  });

  const handleAddToCart = () => {
    if (letters.length === 0) {
      showFeedback('error', 'Please add at least one letter before adding to cart.');
      return;
    }
    addToCartStore(buildCartPayload());
    showFeedback('success', 'Added to cart!');
  };

  const handleBuyNow = () => {
    if (letters.length === 0) {
      showFeedback('error', 'Please add at least one letter before buying.');
      return;
    }
    addToCartStore(buildCartPayload());
    showFeedback('success', 'Added to cart — redirecting to checkout...');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: CONFIGURATION */}
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0A3D91] sm:text-3xl">
                XCEED Holder Configurator
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">Create your holder in real time.</p>
            </section>

            {/* SECTION 1 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Select Letter Size</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={optionCardClass(size === s)}>
                    <span className="text-lg font-extrabold">{s}</span>
                    <span className={`text-xs ${size === s ? 'text-white/80' : 'text-slate-500'}`}>
                      {formatINR(letterPrices[s])}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Letter Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLetterType('CONVEX')}
                  className={optionCardClass(letterType === 'CONVEX')}
                >
                  <span className="text-sm font-bold uppercase tracking-wide">Convex</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLetterType('CONCAVE')}
                  className={optionCardClass(letterType === 'CONCAVE')}
                >
                  <span className="text-sm font-bold uppercase tracking-wide">Concave</span>
                </button>
              </div>
            </section>

            {/* SECTION 4 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Holder Shape</h2>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setShape('SQUARE')} className={optionCardClass(shape === 'SQUARE')}>
                  <span className="text-2xl">▭</span>
                  <span className="text-sm font-bold">Square</span>
                </button>
                <button type="button" onClick={() => setShape('OVAL')} className={optionCardClass(shape === 'OVAL')}>
                  <span className="text-2xl">⬭</span>
                  <span className="text-sm font-bold">Oval</span>
                </button>
              </div>
            </section>

            {/* SECTION 5 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Installation Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInstallation('GLUE')}
                  className={optionCardClass(installation === 'GLUE')}
                >
                  <span className="text-sm font-bold">Glue Type</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInstallation('SCREW')}
                  className={optionCardClass(installation === 'SCREW')}
                >
                  <span className="text-sm font-bold">Screw Type</span>
                </button>
              </div>
            </section>

            {/* SECTION 6 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Holder Capacity</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CAPACITIES.map((c) => (
                  <button key={c} type="button" onClick={() => setCapacity(c)} className={optionCardClass(capacity === c)}>
                    <span className="text-sm font-bold">{c} Letter</span>
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Letter Keyboard</h2>

              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Letters</div>
              <div className="mb-5 flex flex-wrap gap-2">
                {ALPHA.map((ch) => (
                  <button key={ch} type="button" onClick={() => addChar(ch)} className={keyButtonClass} aria-label={`Add ${ch}`}>
                    {ch}
                  </button>
                ))}
              </div>

              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Numbers</div>
              <div className="flex flex-wrap gap-2">
                {DIGITS.map((ch) => (
                  <button key={ch} type="button" onClick={() => addChar(ch)} className={keyButtonClass} aria-label={`Add ${ch}`}>
                    {ch}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: SELECTED / PREVIEW / SUMMARY */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Selected Characters ({letters.length})</h2>
              {letters.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                  No characters added yet — click letters or numbers on the keyboard.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {letters.map((ch, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0A3D91] px-4 py-2 text-sm font-semibold text-white"
                    >
                      {ch}
                      <button
                        type="button"
                        onClick={() => removeCharAt(index)}
                        className="text-white/70 transition-colors hover:text-white"
                        aria-label={`Remove ${ch}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Live Holder Preview</h2>

              {holders.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                  Add letters to generate your holder preview.
                </p>
              ) : (
                <div className="space-y-4">
                  {holders.map((group, hIndex) => (
                    <div key={hIndex}>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Holder {hIndex + 1}
                      </div>
                      <div
                        className={`flex w-fit gap-2 border-2 border-slate-400 bg-white p-4 shadow-sm ${
                          shape === 'OVAL' ? 'rounded-full' : 'rounded-lg'
                        }`}
                      >
                        {group.map((ch, cIndex) => (
                          <div
                            key={cIndex}
                            className="flex h-14 w-14 items-center justify-center border-2 border-slate-200 text-2xl font-bold text-slate-900"
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-xs text-slate-400">
                {size} · {letterType} · {shape === 'SQUARE' ? 'Square' : 'Oval'} Holder ·{' '}
                {installation === 'GLUE' ? 'Glue' : 'Screw'} Type · Capacity {capacity}
              </p>
            </section>

            <section className="rounded-2xl bg-[#0A3D91] p-6 text-white shadow-[0_5px_20px_rgba(10,61,145,0.3)]">
              <h2 className="mb-1 text-lg font-bold">Price Summary</h2>
              <hr className="my-3 border-white/20" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Letter Price</span>
              </div>
              <p className="text-2xl font-extrabold">{formatINR(letterPrice)}</p>
              <hr className="my-3 border-white/20" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Holder Price</span>
              </div>
              <p className="text-2xl font-extrabold">{formatINR(holderPrice)}</p>
              <hr className="my-3 border-white/20" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrement}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 font-bold text-white transition-colors hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={increment}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 font-bold text-white transition-colors hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <hr className="my-3 border-white/20" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">GST (18%)</span>
              </div>
              <p className="text-2xl font-extrabold">{formatINR(gst)}</p>
              <hr className="my-3 border-white/20" />

              <p className="text-base font-bold text-white/90">Grand Total</p>
              <p className="text-4xl font-extrabold">{formatINR(grandTotal)}</p>

              {feedback && (
                <p
                  className={`mt-4 rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                    feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {feedback.text}
                </p>
              )}

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full rounded-xl border border-white/40 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-[#0A3D91] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
