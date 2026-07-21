'use client';

import { useState } from 'react';
import { submitQuoteRequest } from '@/lib/api';
import Button from '@/components/ui/Button';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const PRODUCT_CATEGORIES = [
  'General Enquiry',
  'Cast Letters',
  'Cast Numbers',
  'Holders',
  'Magnetic Tools',
  'Custom Marking',
];

const EMPTY_FORM = {
  fullName: '',
  companyName: '',
  mobileNumber: '',
  email: '',
  city: '',
  state: '',
  productCategory: PRODUCT_CATEGORIES[0],
  productRequired: '',
  quantity: '',
  message: '',
  consent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitQuoteRequest({
        companyName: form.companyName.trim() || form.fullName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        contactPerson: form.fullName,
        city: form.city,
        state: form.state,
        industry: form.productCategory,
        productRequirement: form.productRequired.trim() || form.message.trim() || form.productCategory,
        quantity: form.quantity,
        specialRequirement: form.message,
        source: 'Contact Us',
      });
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-lg sm:p-8">
      <h3 className="text-xl font-bold tracking-tight text-brand-black">Send Us an Enquiry</h3>
      <p className="mt-2 text-sm text-brand-slate">
        Fill out the form below, and our team will contact you shortly.
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
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company Name"
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
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email Address*"
          className={INPUT_CLASSES}
        />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className={INPUT_CLASSES} />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={INPUT_CLASSES} />
        <select
          name="productCategory"
          value={form.productCategory}
          onChange={handleChange}
          className={`${INPUT_CLASSES} bg-white`}
        >
          {PRODUCT_CATEGORIES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity Required"
          className={INPUT_CLASSES}
        />
        <input
          name="productRequired"
          value={form.productRequired}
          onChange={handleChange}
          placeholder="Product Required (Optional)"
          className={`${INPUT_CLASSES} sm:col-span-2`}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="Your Message"
          className={`${INPUT_CLASSES} resize-none sm:col-span-2`}
        />

        <label className="flex items-start gap-2 text-xs leading-relaxed text-brand-slate sm:col-span-2">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-border text-brand-red focus:ring-brand-red/20"
          />
          I agree to be contacted by XCEED India regarding my enquiry.
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={status === 'submitting'} variant="primary" className="w-full">
            {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
          </Button>
        </div>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600 sm:col-span-2">
            Thanks! Your enquiry has been received — our team will contact you shortly.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
