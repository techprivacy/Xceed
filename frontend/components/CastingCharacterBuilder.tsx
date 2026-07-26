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
    <div className="section-space container-x">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
        XCEED {config.title}
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold text-brand-charcoal">Select Size</h2>
          <div className="flex flex-wrap gap-3">
            {Object.keys(PRICES).map((item) => (
              <button
                key={item}
                onClick={() => setSize(item)}
                className={`min-w-[4.5rem] rounded-lg border px-6 py-3 text-center transition-colors ${
                  size === item
                    ? 'border-brand-red bg-brand-red text-white'
                    : 'border-black/10 text-brand-charcoal hover:border-brand-red/40'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <h2 className="mb-3 mt-8 font-semibold text-brand-charcoal">Select {config.noun} Type</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setType('CONVEX')}
              className={`flex-1 rounded-lg py-3 text-center transition-colors ${
                type === 'CONVEX' ? 'bg-brand-navy text-white' : 'bg-brand-mist text-brand-charcoal'
              }`}
            >
              CONVEX
            </button>
            <button
              onClick={() => setType('CONCAVE')}
              className={`flex-1 rounded-lg py-3 text-center transition-colors ${
                type === 'CONCAVE' ? 'bg-brand-red text-white' : 'bg-brand-mist text-brand-charcoal'
              }`}
            >
              CONCAVE
            </button>
          </div>

          <h2 className="mb-3 mt-8 font-semibold text-brand-charcoal">Add {config.noun}</h2>
          <label className="mb-1 block text-xs font-semibold text-brand-slate">Current {config.noun}</label>
          <div className="flex items-center gap-3">
            <input
              maxLength={1}
              value={current}
              onChange={(e) =>
                setCurrent(mode === 'letters' ? e.target.value.toUpperCase() : e.target.value.replace(/[^0-9]/g, ''))
              }
              className="w-24 rounded-lg border border-black/10 p-3 text-center text-2xl outline-none focus:ring-2 focus:ring-brand-red/20"
            />
            <button onClick={addCharacter} className="rounded-lg bg-brand-red px-6 py-3 text-white transition-colors hover:bg-brand-redDark">
              + Add
            </button>
          </div>

          {feedback && (
            <p className={`mt-3 text-sm font-medium ${feedback.type === 'error' ? 'text-brand-red' : 'text-green-600'}`}>
              {feedback.text}
            </p>
          )}

          <div className="mt-8">
            <h2 className="mb-3 font-semibold text-brand-charcoal">Current {config.nounPlural}</h2>
            <div className="flex flex-wrap gap-3">
              {characters.map((item, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-brand-navy px-5 py-3 text-white">
                  <span className="text-xl">{item}</span>
                  <button onClick={() => removeCharacter(index)} aria-label={`Remove ${item}`}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border-4 border-brand-navy p-8">
            <h2 className="text-xl font-bold text-brand-charcoal">Live Preview</h2>
            <div className="mt-6 flex flex-wrap gap-3 text-6xl text-brand-charcoal">
              {characters.map((character, i) => (
                <span key={i}>{character}</span>
              ))}
            </div>
            <div className="mt-6 text-brand-charcoal">
              <p>Size : <strong>{size}</strong></p>
              <p>Type : <strong>{type}</strong></p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-brand-mist p-6 text-brand-charcoal">
            <div className="flex justify-between">
              <span>{config.nounPlural}</span>
              <strong>{characters.length}</strong>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Price / {config.noun}</span>
              <strong>{formatINR(pricePerCharacter)}</strong>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Quantity</span>
              <div className="flex items-center gap-2">
                <button onClick={decrement} className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm">-</button>
                <strong>{quantity}</strong>
                <button onClick={increment} className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm">+</button>
              </div>
            </div>

            <hr className="my-4 border-black/10" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <div className="mt-2 flex justify-between">
              <span>GST (18%)</span>
              <strong>{formatINR(Math.round(gst))}</strong>
            </div>

            <hr className="my-4 border-black/10" />

            <div className="flex justify-between text-2xl text-brand-charcoal">
              <span>Total</span>
              <strong>{formatINR(Math.round(total))}</strong>
            </div>
          </div>

          <button
            onClick={addToCart}
            className="mt-6 w-full rounded-xl bg-brand-red py-4 text-lg text-white transition-colors hover:bg-brand-redDark"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
