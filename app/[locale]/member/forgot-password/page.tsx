'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { forgotMemberPassword } from '@/lib/api';
import Button from '@/components/ui/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Backend always returns the same generic message regardless of
      // whether the email matches a member — see memberController.
      // forgotPassword. That's deliberate (no email enumeration), so this
      // form never shows a "no account found" error.
      const res = await forgotMemberPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />

      <div className="flex items-center justify-center bg-brand-navy px-4 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
          <Image src="/logo.png" alt="XCEED India" width={280} height={126} priority className="mb-3 h-10 w-auto object-contain" />
          <h1 className="mb-1 text-lg font-bold text-brand-black">Forgot your password?</h1>
          <p className="mb-6 text-sm text-brand-slate">
            Enter the email on your Member Portal account and, if it&apos;s approved, we&apos;ll send you a new
            password.
          </p>

          {message ? (
            <p className="rounded-xl bg-brand-mist p-4 text-sm text-brand-charcoal">{message}</p>
          ) : (
            <>
              <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="mb-6 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />

              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Sending...' : 'Send New Password'}
              </Button>
            </>
          )}

          <p className="mt-5 text-center text-xs text-brand-slate">
            <Link href="/member/login" className="font-semibold text-brand-red hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}
