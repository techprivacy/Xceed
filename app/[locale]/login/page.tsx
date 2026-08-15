'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { login, accountLogin } from '@/lib/api';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// No pr-* here on purpose: the identifier field adds its own (plain right
// padding), the password field doesn't (PasswordInput appends its own pr-10
// for the eye button) — baking either into this shared base would either
// conflict with or duplicate whichever one each field actually needs.
const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border py-2.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue';

function IconField({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-slate" />
      {children}
    </div>
  );
}

// The one login for the whole site — regular users and staff/admins both
// sign in here rather than at separate pages (/member/login and
// /admin/login both now just redirect here). The account systems
// underneath stay separate — different database models, different token
// types, different middleware (see backend/src/middlewares/accountAuth.js
// vs auth.js) — this page just tries both APIs against the one form and
// routes by whichever one recognizes the credentials. Membership
// (MembershipApplication) has no login of its own — it's a status attached
// to an Account, applied for after signing in here, not a separate
// credential system.
export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Regular accounts are the common case (public-facing), so try that
    // first. An unverified-email account returns a specific, non-generic
    // message — that's a conclusive match on a real account, so it's
    // surfaced directly instead of silently falling through to the admin
    // attempt below and showing a misleading "invalid credentials" instead.
    try {
      const accountRes = await accountLogin(identifier, password);
      localStorage.setItem('xceed_account_token', accountRes.token);
      window.location.href = '/member/dashboard';
      return;
    } catch (accountErr) {
      const message = accountErr instanceof Error ? accountErr.message : '';
      if (message && message !== 'Invalid credentials') {
        setError(message);
        setLoading(false);
        return;
      }
    }

    try {
      const adminRes = await login(identifier, password);
      localStorage.setItem('xceed_admin_token', adminRes.token);
      window.location.href = '/admin/dashboard';
      return;
    } catch {
      // Deliberately generic — doesn't reveal whether the identifier
      // matched a member, an admin, or neither.
      setError('Invalid email/username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />

      <div className="flex items-center justify-center bg-brand-navy px-4 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl sm:p-9">
          <Image src="/logo.png" alt="XCEED" width={280} height={126} priority className="mb-3 h-10 w-auto object-contain" />
          <h1 className="text-xl font-bold text-brand-black">Welcome back</h1>
          <p className="mb-6 mt-1 text-sm text-brand-slate">Sign in to your XCEED account.</p>

          <label htmlFor="login-identifier" className="mb-1.5 block text-xs font-semibold text-brand-charcoal">
            Email or Username
          </label>
          <IconField icon={Mail}>
            <input
              id="login-identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              placeholder="you@company.com"
              className={`${INPUT_CLASSES} pr-4 mb-4`}
            />
          </IconField>

          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-semibold text-brand-charcoal">
              Password
            </label>
            <Link href="/member/forgot-password" className="text-xs font-semibold text-brand-blue hover:underline">
              Forgot password?
            </Link>
          </div>
          <IconField icon={Lock}>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${INPUT_CLASSES} mb-6`}
            />
          </IconField>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
