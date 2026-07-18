'use client';

import { useState } from 'react';
import { UserPlus, User, Building2, Mail, Phone, MessageCircle, MapPin, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import { submitQuoteRequest } from '@/lib/api';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white py-2.5 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-blue/20';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

const EMPTY_FORM = {
  fullName: '',
  companyName: '',
  email: '',
  mobileNumber: '',
  whatsappNumber: '',
  city: '',
  state: '',
  officeAddress: '',
};

function IconField({
  icon: Icon,
  children,
}: {
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue" />
      {children}
    </div>
  );
}

export default function MembershipForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        whatsappNumber: form.whatsappNumber,
        productRequirement: 'Membership Application',
        contactPerson: form.fullName,
        email: form.email,
        city: form.city,
        state: form.state,
        officeAddress: form.officeAddress,
      });
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-blue to-brand-blueDark px-6 py-5 sm:px-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <UserPlus size={22} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">Become a Member Today</h3>
          <p className="text-xs text-white/80">Fill in the form below to apply for membership.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
        <IconField icon={User}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Full Name*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Building2}>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            placeholder="Company Name*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Mail}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email Address*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Phone}>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile Number*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={MessageCircle}>
          <input
            name="whatsappNumber"
            value={form.whatsappNumber}
            onChange={handleChange}
            required
            placeholder="WhatsApp No.*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={MapPin}>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="City*"
            className={INPUT_CLASSES}
          />
        </IconField>

        <div className="relative sm:col-span-2">
          <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue" />
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className={`${INPUT_CLASSES} appearance-none pr-10 ${form.state ? '' : 'text-brand-slate'}`}
          >
            <option value="" disabled>
              State*
            </option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="text-brand-charcoal">
                {state}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
        </div>

        <div className="relative sm:col-span-2">
          <Building2 size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-brand-blue" />
          <textarea
            name="officeAddress"
            value={form.officeAddress}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Office Address*"
            className={`${INPUT_CLASSES} resize-none pt-3`}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blueDark px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-blue/30 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Membership Application'}
          <ArrowRight size={16} />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs italic text-brand-slate sm:col-span-2">
          <ShieldCheck size={13} className="shrink-0 text-brand-blue" />
          Our team will contact you within 24 hours to confirm your membership.
        </p>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600 sm:col-span-2">
            Thanks! Your membership application has been received.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
