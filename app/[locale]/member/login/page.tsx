'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { memberLogin } from '@/lib/api';
import Button from '@/components/ui/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MemberLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await memberLogin(email, password);
      localStorage.setItem('xceed_member_token', res.token);
      window.location.href = '/member/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <p className="mb-6 text-sm text-brand-slate">Sign in to your XCEED Member Portal.</p>

          <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="mb-4 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />

          <div className="mb-1 flex items-center justify-between">
            <label className="block text-xs font-semibold text-brand-charcoal">Password</label>
            <Link href="/member/forgot-password" className="text-xs font-semibold text-brand-blue hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="mb-6 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} variant="primary" className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="mt-5 space-y-2 border-t border-black/5 pt-5 text-center text-xs text-brand-slate">
            <p>
              New here?{' '}
              <Link href="/member/register" className="font-semibold text-brand-red hover:underline">
                Create an Account
              </Link>
            </p>
            <p>
              <Link href="/membership/register" className="font-semibold text-brand-red hover:underline">
                Register your Business with us
              </Link>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
