'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyAccountEmail } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing its token.');
      return;
    }
    verifyAccountEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'This verification link is invalid or has expired.');
      });
  }, [token]);

  return (
    <main>
      <Header />

      <div className="flex items-center justify-center bg-brand-navy px-4 py-16">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
          {status === 'verifying' && (
            <>
              <Loader2 size={40} className="mx-auto mb-4 animate-spin text-brand-blue" />
              <h1 className="text-lg font-bold text-brand-black">Verifying your email…</h1>
            </>
          )}
          {status === 'success' && (
            <>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <CheckCircle2 size={28} />
              </span>
              <h1 className="text-lg font-bold text-brand-black">Email verified</h1>
              <p className="mt-2 text-sm text-brand-slate">{message}</p>
              <Link
                href="/login"
                className="mt-6 block w-full rounded-xl bg-brand-red px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-redDark"
              >
                Sign In
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <XCircle size={28} />
              </span>
              <h1 className="text-lg font-bold text-brand-black">Verification failed</h1>
              <p className="mt-2 text-sm text-brand-slate">{message}</p>
              <Link href="/login" className="mt-6 block text-sm font-semibold text-brand-red hover:underline">
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
