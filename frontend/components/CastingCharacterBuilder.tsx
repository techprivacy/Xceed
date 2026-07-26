'use client';

import { useState } from 'react';
import { addToCart as addToCartStore } from '@/lib/cart';
import { useTimedFeedback } from '@/lib/useTimedFeedback';
import { useQuantity } from '@/lib/useQuantity';
import { calculateGst } from '@/lib/tax';
import { formatINR } from '@/lib/format';
import { SizePrice } from '@/types';

// Reference pricing — used until an admin-configured product provides sizePricing
const DEFAULT_PRICES: Record<string, number> = {
  '5mm': 95,
  '6mm': 100,
  '7mm': 105,
  '8mm': 115,
};

// Shared with HolderConfigurator so the three configurator pages read as one
// product family — same canvas, card treatment, and selected-option styling.
const CARD = 'rounded-2xl bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)]';

const optionCardClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
    active
      ? 'border-[#0A3D91] bg-[#0A3D91] text-white shadow-md shadow-[#0A3D91]/20'
      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0A3D91] hover:bg-blue-50'
  }`;

type CastType = 'CONVEX' | 'CONCAVE';
type Mode = 'letters' | 'numbers';

const MODE_CONFIG: Record<
  Mode,
  { title: string; noun: string; nounPlural: string; default: string; pattern: RegExp; errorText: string }
> = {
  letters: {
    title: 'Cast Letter Builder',
    noun: 'Letter',
    nounPlural: 'Letters',
    default: 'A',
    pattern: /^[A-Z]$/,
    errorText: 'Only A-Z allowed',
  },
  numbers: {
    title: 'Cast Number Builder',
    noun: 'Number',
    nounPlural: 'Numbers',
    default: '0',
    pattern: /^[0-9]$/,
    errorText: 'Only 0-9 allowed',
  },
};

interface CastingCharacterBuilderProps {
  mode: Mode;
  sizePricing?: SizePrice[];
}

export default function CastingCharacterBuilder({ mode, sizePricing }: CastingCharacterBuilderProps) {
  const config = MODE_CONFIG[mode];
  const PRICES: Record<string, number> = sizePricing?.length
    ? Object.fromEntries(sizePricing.map((s) => [s.size, s.price]))
    : DEFAULT_PRICES;

  const [size, setSize] = useState<string>(Object.keys(PRICES)[0] ?? '5mm');
  const [type, setType] = useState<CastType>('CONVEX');
  const [current, setCurrent] = useState('');
  const [characters, setCharacters] = useState<string[]>([config.default]);
  const { quantity, increment, decrement, setQuantity } = useQuantity();
  const { feedback, showFeedback } = useTimedFeedback();

  const pricePerCharacter = PRICES[size];
  const subtotal = characters.length * pricePerCharacter * quantity;
  const gst = calculateGst(subtotal);
  const total = subtotal + gst;

  const addCharacter = () => {
    const value = mode === 'letters' ? current.toUpperCase() : current.trim();

    if (!config.pattern.test(value)) {
      showFeedback('error', config.errorText);
      return;
    }

    setCharacters([...characters, value]);
    setCurrent('');
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const addToCart = () => {
    if (characters.length === 0) {
      showFeedback('error', `Please add at least one ${config.noun.toLowerCase()}.`);
      return;
    }

    addToCartStore({
      kind: mode,
      size,
      type,
      letters: characters,
      letterCount: characters.length,
      pricePerLetter: pricePerCharacter,
      quantity,
      total,
      gst,
    });

    showFeedback('success', 'Added to cart!');
    setCharacters([config.default]);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: CONFIGURATION */}
          <div className="space-y-6 lg:col-span-7">
            <section className={CARD}>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0A3D91] sm:text-3xl">
                XCEED {config.title}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Build your {config.nounPlural.toLowerCase()} in real time.
              </p>
            </section>

            <section className={CARD}>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Select Size</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.keys(PRICES).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={optionCardClass(size === item)}
                  >
                    <span className="text-lg font-extrabold">{item}</span>
                    <span className={`text-xs ${size === item ? 'text-white/80' : 'text-slate-500'}`}>
                      {formatINR(PRICES[item])}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className={CARD}>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Select {config.noun} Type</h2>
              <div className="grid grid-cols-2 gap-4">
                {(['CONVEX', 'CONCAVE'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setType(option)}
                    className={optionCardClass(type === option)}
                  >
                    <span className="text-base font-extrabold">{option}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={CARD}>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Add {config.noun}</h2>
              <label
                className="mb-1.5 block text-xs font-semibold text-slate-500"
                htmlFor="casting-character-input"
              >
                Current {config.noun}
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="casting-character-input"
                  maxLength={1}
                  value={current}
                  onChange={(e) =>
                    setCurrent(
                      mode === 'letters'
                        ? e.target.value.toUpperCase()
                        : e.target.value.replace(/[^0-9]/g, '')
                    )
                  }
                  className="w-24 rounded-xl border-2 border-slate-200 p-3 text-center text-2xl font-bold text-slate-900 outline-none transition-colors focus:border-[#0A3D91]"
                />
                <button
                  type="button"
                  onClick={addCharacter}
                  className="rounded-xl bg-[#0A3D91] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  + Add
                </button>
              </div>

              {feedback && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    feedback.type === 'error' ? 'text-brand-red' : 'text-green-600'
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </section>

            <section className={CARD}>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Current {config.nounPlural}</h2>
              {characters.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                  No {config.nounPlural.toLowerCase()} added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {characters.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl bg-[#0A3D91] px-5 py-3 text-white shadow-sm"
                    >
                      <span className="text-xl font-bold">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeCharacter(index)}
                        aria-label={`Remove ${item}`}
                        className="text-white/70 transition-colors hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: PREVIEW + SUMMARY */}
          <div className="space-y-6 lg:col-span-5">
            <section className={CARD}>
              <h2 className="mb-4 text-lg font-bold text-slate-900">Live Preview</h2>
              {characters.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                  Add a {config.noun.toLowerCase()} to see it here.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {characters.map((character, i) => (
                    <span
                      key={i}
                      className="flex h-14 w-14 items-center justify-center border-2 border-slate-200 text-2xl font-bold text-slate-900"
                    >
                      {character}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex gap-6 text-sm text-slate-500">
                <p>
                  Size: <strong className="text-slate-900">{size}</strong>
                </p>
                <p>
                  Type: <strong className="text-slate-900">{type}</strong>
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-[#0A3D91] p-6 text-white shadow-[0_5px_20px_rgba(10,61,145,0.3)]">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <hr className="my-3 border-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-white/80">{config.nounPlural}</span>
                <strong>{characters.length}</strong>
              </div>

              <hr className="my-3 border-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Price / {config.noun}</span>
                <strong>{formatINR(pricePerCharacter)}</strong>
              </div>

              <hr className="my-3 border-white/20" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrement}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 font-bold text-white transition-colors hover:bg-white/10"
                  >
                    -
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={increment}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 font-bold text-white transition-colors hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              <hr className="my-3 border-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Subtotal</span>
                <strong>{formatINR(subtotal)}</strong>
              </div>

              <hr className="my-3 border-white/20" />
              <div className="flex justify-between text-sm">
                <span className="text-white/80">GST (18%)</span>
                <strong>{formatINR(Math.round(gst))}</strong>
              </div>

              <hr className="my-3 border-white/20" />
              <div className="flex items-end justify-between">
                <span className="text-sm text-white/80">Total</span>
                <h3 className="text-3xl font-extrabold">{formatINR(Math.round(total))}</h3>
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="mt-5 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-[#0A3D91] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Add To Cart
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
