'use client';

import { useState } from 'react';
import Image from 'next/image';
import { login } from '@/lib/api';
import Button from '@/components/ui/Button';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      localStorage.setItem('xceed_admin_token', res.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <SiteHeader />
      <div className="flex min-h-[70vh] items-center justify-center bg-brand-navy px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
        >
          <Image src="/logo.png" alt="XCEED India" width={280} height={126} priority className="mb-3 h-10 w-auto object-contain" />
          <p className="mb-6 text-sm text-brand-slate">Sign in to manage products &amp; quote requests.</p>

          <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin"
            className="mb-4 w-full rounded-xl border border-brand-border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />

          <label className="mb-1 block text-xs font-semibold text-brand-charcoal">Password</label>
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
        </form>
      </div>
      <Footer />
    </main>
  );
}
