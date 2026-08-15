'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetAccountPassword } from '@/lib/api';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('This reset link is missing its token.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetAccountPassword(token, password);
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />

      <div className="flex items-center justify-center bg-brand-navy px-4 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="mb-1 text-lg font-bold text-brand-black">Set a new password</h1>

          {message ? (
            <>
              <p className="mb-4 rounded-xl bg-brand-mist p-4 text-sm text-brand-charcoal">{message}</p>
              <Link
                href="/login"
                className="block w-full rounded-xl bg-brand-red px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-redDark"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-sm text-brand-slate">Choose a new password for your account.</p>

              <label className="mb-1 block text-xs font-semibold text-brand-charcoal">New Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="mb-4 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />

              <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="mb-6 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />

              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </>
          )}

          <p className="mt-5 text-center text-xs text-brand-slate">
            <Link href="/login" className="font-semibold text-brand-red hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}
