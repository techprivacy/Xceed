'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Info } from 'lucide-react';
import { getMemberToken, getMyMemberProfile } from '@/lib/api';
import { Member, SubscriptionStatus } from '@/types';

const STATUS_COPY: Record<SubscriptionStatus, { label: string; tone: string; text: string }> = {
  active: {
    label: 'Active',
    tone: 'bg-green-100 text-green-700',
    text: 'Your membership subscription is active.',
  },
  expired: {
    label: 'Expired',
    tone: 'bg-red-100 text-red-700',
    text: 'Your subscription has expired. Contact the XCEED team to renew.',
  },
  none: {
    label: 'None',
    tone: 'bg-brand-mist text-brand-slate',
    text: 'No subscription has been set up on your account yet.',
  },
};

export default function MemberSubscriptionPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getMemberToken();
    if (!token) return;
    getMyMemberProfile(token)
      .then((res) => setMember(res.data))
      .finally(() => setLoading(false));
  }, []);

  const status = member?.subscriptionStatus ?? 'none';
  const copy = STATUS_COPY[status];

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-brand-black">Subscription</h1>
        <p className="text-sm text-brand-slate">Your XCEED membership subscription status.</p>
      </div>

      {loading ? (
        <p className="text-sm text-brand-slate">Loading...</p>
      ) : (
        <div className="max-w-xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
              <CreditCard size={22} />
            </span>
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${copy.tone}`}>
                {copy.label}
              </span>
              <p className="mt-1.5 text-sm text-brand-charcoal">{copy.text}</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-brand-mist p-4 text-xs text-brand-slate">
            <Info size={14} className="mt-0.5 shrink-0" />
            Subscription status is set manually by the XCEED team — there is no online payment on this
            portal yet. To activate or renew, contact XCEED India directly.
          </div>
        </div>
      )}
    </main>
  );
}
