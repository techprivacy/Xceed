'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, PackageSearch, Truck, Home, ClipboardList } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
      <SiteHeader />

      <section className="bg-brand-navy py-14">
        <div className="container-x text-center">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Order Status
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Track Your Order</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            Enter your order number and the email address used at checkout to see the latest
            status of your delivery.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-x max-w-xl">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Order Number *</label>
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. XI-10293"
                  className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>

              <Button type="submit" disabled={status === 'loading'} variant="primary" className="sm:col-span-2">
                {status === 'loading' ? 'Searching...' : 'Track Order'}
              </Button>

              {status === 'error' && (
                <p className="text-sm font-medium text-red-600 sm:col-span-2">
                  Please enter both your order number and email address.
                </p>
              )}
            </form>
          </Card>

          {status === 'found' && result && (
            <Card className="mt-8 animate-fadeIn p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-slate">Order Number</p>
                  <p className="text-sm font-bold text-brand-red">{result.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-slate">Placed On</p>
                  <p className="text-sm font-semibold text-brand-charcoal">{result.placedOn}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-slate">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-brand-charcoal">{result.estimatedDelivery}</p>
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
                            done ? 'bg-brand-blue text-white' : 'bg-brand-mist text-brand-slate'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        {!isLast && (
                          <div
                            className={`h-0.5 flex-1 ${i < result.currentStep ? 'bg-brand-blue' : 'bg-brand-border'}`}
                          />
                        )}
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${done ? 'text-brand-blue' : 'text-brand-slate'}`}>
                        {step.label}
                      </p>
                      {done && i === result.currentStep && (
                        <CheckCircle2 size={14} className="mt-1 text-brand-blue" />
                      )}
                      {!done && <Circle size={14} className="mt-1 text-brand-border" />}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
