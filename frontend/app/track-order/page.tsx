'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, PackageSearch, Truck, Home, ClipboardList } from 'lucide-react';
import TopBar from '@/components/TopBar';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: ClipboardList },
  { key: 'processing', label: 'Processing', icon: PackageSearch },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

interface TrackingResult {
  orderNumber: string;
  placedOn: string;
  estimatedDelivery: string;
  currentStep: number;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setStatus('error');
      setResult(null);
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setResult({
        orderNumber: orderNumber.trim().toUpperCase(),
        placedOn: '28 Jun 2026',
        estimatedDelivery: '08 Jul 2026',
        currentStep: 2,
      });
      setStatus('found');
    }, 700);
  };

  return (
    <main>
      <TopBar />
      <SiteHeader />

      <section className="bg-brand-navy py-14">
        <div className="container-x text-center">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">Track Your Order</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Enter your order number and the email address used at checkout to see the latest
            status of your delivery.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border p-6 shadow-sm sm:grid-cols-2"
          >
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Order Number *
              </label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. XI-10293"
                className="w-full rounded border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-blueDarker hover:to-brand-blueDarker hover:shadow-xl hover:shadow-brand-blue/40 disabled:opacity-60 disabled:hover:translate-y-0 sm:col-span-2"
            >
              {status === 'loading' ? 'Searching...' : 'Track Order'}
            </button>

            {status === 'error' && (
              <p className="text-sm font-medium text-red-600 sm:col-span-2">
                Please enter both your order number and email address.
              </p>
            )}
          </form>

          {status === 'found' && result && (
            <div className="mt-8 animate-fadeIn rounded-xl border border-brand-border p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Order Number</p>
                  <p className="text-sm font-bold text-brand-blue">{result.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Placed On</p>
                  <p className="text-sm font-semibold text-gray-800">{result.placedOn}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{result.estimatedDelivery}</p>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= result.currentStep;
                  const isLast = i === STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                      <div className="flex w-full items-center">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            done ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        {!isLast && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i < result.currentStep ? 'bg-brand-blue' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs font-semibold ${
                          done ? 'text-brand-blue' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {done && i === result.currentStep && (
                        <CheckCircle2 size={14} className="mt-1 text-brand-blue" />
                      )}
                      {!done && <Circle size={14} className="mt-1 text-gray-300" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
