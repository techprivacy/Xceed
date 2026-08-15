'use client';

import { useState } from 'react';
import { UserPlus, User, Mail, Phone, Globe2, ArrowRight } from 'lucide-react';
import { registerMember } from '@/lib/api';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white py-3.5 pl-11 pr-4 text-base text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const EMPTY_FORM = { fullName: '', email: '', mobileNumber: '', country: '' };

function IconField({ icon: Icon, children }: { icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue" />
      {children}
    </div>
  );
}

// Deliberately a short, personal form — four fields, no company/industry/
// products/website/membership-type questions — distinct from
// MembershipForm's full business application. Both submit to the same
// registerMember endpoint underneath (there's no separate "individual
// account" schema on the backend — see Member.js), but companyName is a
// required field there, so it's backfilled with the person's own name and
// membershipType defaults to 'Industry Professional', the one category in
// the existing enum that already means "not a company."
export default function CreateAccountForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await registerMember({
        companyName: form.fullName,
        contactPerson: form.fullName,
        email: form.email,
        mobileNumber: form.mobileNumber,
        country: form.country,
        location: form.country,
        membershipType: 'Industry Professional',
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
      <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-brand-blue to-brand-blueDark px-6 py-8 text-center sm:px-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <UserPlus size={28} />
        </span>
        <div>
          <h3 className="text-2xl font-bold text-white">Create Your Account</h3>
          <p className="mt-1 text-sm text-white/80">Just a few details — our team will confirm your access.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-8 sm:p-10">
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
        <IconField icon={Mail}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Phone}>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile / WhatsApp*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Globe2}>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            placeholder="Country*"
            className={INPUT_CLASSES}
          />
        </IconField>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blueDark px-8 py-4 text-base font-semibold text-white shadow-md shadow-brand-blue/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Creating...' : 'Create Account'}
          <ArrowRight size={18} />
        </button>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600">
            Thanks! We&apos;ve received your details. Once confirmed, we&apos;ll email your Member Portal login to
            the address above.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600">{errorMsg}</p>}

        <p className="text-center text-xs text-brand-slate">
          Signing up on behalf of a company instead?{' '}
          <a href="/membership/register" className="font-semibold text-brand-red hover:underline">
            Register your Business
          </a>
        </p>
      </form>
    </div>
  );
}
