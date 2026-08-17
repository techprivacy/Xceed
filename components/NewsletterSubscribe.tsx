'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { subscribeToNewsletter } from '@/lib/api';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      const res = await subscribeToNewsletter(email.trim());
      setStatus('success');
      setMessage(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-brand-slate">Subscribe</h4>
      <p className="mt-2 text-sm text-brand-slate">Get the latest updates and offers from XCEED.</p>

      <form onSubmit={handleSubmit} className="mt-4 flex max-w-sm gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email address"
          className="w-full min-w-0 rounded-xl border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe"
          className="flex shrink-0 items-center justify-center rounded-xl bg-brand-blue px-4 py-2.5 text-white transition-colors hover:bg-brand-blueDark disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>

      {status === 'success' && <p className="mt-2 text-sm font-medium text-green-600">{message}</p>}
      {status === 'error' && <p className="mt-2 text-sm font-medium text-red-600">{message}</p>}
    </div>
  );
}
