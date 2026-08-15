'use client';

import { useState } from 'react';
import { UserPlus, User, Mail, Lock, ArrowRight, MailCheck } from 'lucide-react';
import { registerAccount } from '@/lib/api';
import PasswordInput from '@/components/ui/PasswordInput';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white py-3.5 pl-11 text-base text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-blue/20';

const EMPTY_FORM = { fullName: '', email: '', password: '', confirmPassword: '' };

function IconField({ icon: Icon, children }: { icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue" />
      {children}
    </div>
  );
}

// True self-service signup: Full Name, Email, Password, Confirm Password ->
// Create Account -> email verification -> account activated -> login. No
// admin approval anywhere in this flow — that's the whole point of Account
// vs. the separate, still-approval-gated MembershipApplication (see
// MembershipForm.tsx), which an already-signed-in Account holder can apply
// for afterwards as its own distinct step.
export default function CreateAccountForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setStatus('error');
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setStatus('error');
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      await registerAccount({ fullName: form.fullName, email: form.email, password: form.password });
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white p-10 text-center shadow-xl">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
          <MailCheck size={28} />
        </span>
        <h3 className="text-xl font-bold text-brand-black">Check your email</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-slate">
          We&apos;ve sent a verification link to your email address. Click it to activate your account, then sign
          in — no approval wait, you&apos;re ready as soon as it&apos;s verified.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">
      <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-brand-blue to-brand-blueDark px-6 py-8 text-center sm:px-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <UserPlus size={28} />
        </span>
        <div>
          <h3 className="text-2xl font-bold text-white">Create Your Account</h3>
          <p className="mt-1 text-sm text-white/80">Instant — no approval wait. Just verify your email.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-8 sm:p-10">
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
            placeholder="Email Address*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Lock}>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Password*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Lock}>
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Confirm Password*"
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

        {status === 'error' && <p className="text-sm font-medium text-red-600">{errorMsg}</p>}

        <p className="text-center text-xs text-brand-slate">
          Signing up on behalf of a company?{' '}
          <a href="/membership/register" className="font-semibold text-brand-red hover:underline">
            Create an account first, then apply for Membership
          </a>
          .
        </p>
      </form>
    </div>
  );
}
