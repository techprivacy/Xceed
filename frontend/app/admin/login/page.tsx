'use client';

import { useState } from 'react';
import { login } from '@/lib/api';

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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-100 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-extrabold text-gray-900">XCEED India Admin</h1>
        <p className="mb-6 text-sm text-gray-500">Sign in to manage products &amp; quote requests.</p>

        <label className="mb-1 block text-xs font-semibold text-gray-700">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="ak"
          className="mb-4 w-full rounded border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />

        <label className="mb-1 block text-xs font-semibold text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="mb-6 w-full rounded border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-gradient-to-r from-brand-blueDark to-brand-blue py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:from-brand-blueDarker hover:to-brand-blueDarker disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
