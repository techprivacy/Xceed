'use client';

import { useState } from 'react';
import { submitQuoteRequest } from '@/lib/api';

export default function QuoteFormSection() {
  const [form, setForm] = useState({
    companyName: '',
    mobileNumber: '',
    productRequirement: '',
    quantity: '',
    city: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitQuoteRequest(form);
      setStatus('success');
      setForm({ companyName: '', mobileNumber: '', productRequirement: '', quantity: '', city: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="quote-form" className="bg-brand-navy py-14">
      <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="text-white">
          <h2 className="text-2xl font-extrabold leading-tight">
            Need Custom Marking Tools for Your Factory?
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Tell us your requirement and our expert team will get back to you with the best
            solution and pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            placeholder="Company Name*"
            className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile Number*"
            className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity (Approx.)*"
            className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City*"
            className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <input
            name="productRequirement"
            value={form.productRequirement}
            onChange={handleChange}
            required
            placeholder="Product Requirement*"
            className="rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-brand-blue sm:col-span-2"
          />

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-blueDarker hover:to-brand-blueDarker hover:shadow-xl hover:shadow-brand-blue/40 disabled:opacity-60 disabled:hover:translate-y-0 sm:col-span-2"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
          </button>

          {status === 'success' && (
            <p className="text-sm font-medium text-green-400 sm:col-span-2">
              Thanks! Your request has been submitted — our team will contact you shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm font-medium text-red-400 sm:col-span-2">{errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  );
}
