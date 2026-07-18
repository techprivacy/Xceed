'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { submitQuoteRequest } from '@/lib/api';
import Button from '@/components/ui/Button';

const TOTAL_SEATS = 25;
const SEATS_BOOKED = 6;

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const INTEREST_OPTIONS = ['Business & Leisure Tour 2026', 'Foundry Visits Only', 'General Enquiry'];

export default function TokyoTourEnquiryForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    mobileNumber: '',
    interestedIn: INTEREST_OPTIONS[0],
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitQuoteRequest({
        companyName: form.companyName,
        mobileNumber: form.mobileNumber,
        productRequirement: form.interestedIn,
        contactPerson: form.fullName,
        email: form.email,
      });
      setStatus('success');
      setForm({ fullName: '', email: '', companyName: '', mobileNumber: '', interestedIn: INTEREST_OPTIONS[0] });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-lg sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1755036742496-57094c61f909?w=1200&h=1400&fit=crop"
          alt=""
          fill
          sizes="600px"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="relative">
        <h3 className="text-xl font-bold tracking-tight text-brand-black">Reserve Your Seat for Japan 2026</h3>
        <p className="mt-2 text-sm text-brand-slate">Complete the form below to confirm your seat.</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-4 py-2 text-sm font-bold text-brand-red">
          <Users size={16} />
          Only {TOTAL_SEATS} Exclusive Seats <span className="text-brand-red/40">&bull;</span> {SEATS_BOOKED} Already Booked
        </div>
        <div className="mt-2 h-1.5 w-48 max-w-full overflow-hidden rounded-full bg-brand-red/10">
          <div
            className="h-full rounded-full bg-brand-red"
            style={{ width: `${(SEATS_BOOKED / TOTAL_SEATS) * 100}%` }}
          />
        </div>

        <p className="mt-3 text-xs italic text-brand-slate">
          *Our team will contact you within 24 hours to confirm your registration.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="fullName"
          value={form.fullName}
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
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
          placeholder="Company Name*"
          className={INPUT_CLASSES}
        />
        <select name="interestedIn" value={form.interestedIn} onChange={handleChange} className={`${INPUT_CLASSES} bg-white`}>
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          name="mobileNumber"
          value={form.mobileNumber}
          onChange={handleChange}
          required
          placeholder="Mobile Number*"
          className={`${INPUT_CLASSES} sm:col-span-2`}
        />

        <div className="flex justify-center sm:col-span-2">
          <Button type="submit" disabled={status === 'submitting'} variant="primary">
            {status === 'submitting' ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600 sm:col-span-2">
            Thanks! Our team will reach out with the complete Tokyo tour details shortly.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
