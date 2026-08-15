'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, CreditCard, Calendar, Handshake } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { getAccountToken, getMyAccountProfile, getMyMembershipApplication } from '@/lib/api';
import { Account, MembershipApplication } from '@/types';

export default function MemberDashboardPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [application, setApplication] = useState<MembershipApplication | null>(null);

  useEffect(() => {
    const token = getAccountToken();
    if (!token) return;
    getMyAccountProfile(token)
      .then((res) => setAccount(res.data))
      .catch(() => setAccount(null));
    // A brand-new account has no application yet — that's expected, not an
    // error, since applying for membership is now its own separate step.
    getMyMembershipApplication(token)
      .then((res) => setApplication(res.data))
      .catch(() => setApplication(null));
  }, []);

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-brand-black">
          Welcome{account ? `, ${account.fullName}` : ''}
        </h1>
        <p className="text-sm text-brand-slate">{account?.email}</p>
      </div>

      {!application && account && (
        <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-brand-red/15 bg-brand-red/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
              <Handshake size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-black">Not a member yet</p>
              <p className="text-xs text-brand-slate">Apply for membership to join the directory and get member benefits.</p>
            </div>
          </div>
          <Link
            href="/membership/register"
            className="shrink-0 rounded-xl bg-brand-red px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-redDark"
          >
            Apply for Membership
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Membership Status"
          value={application ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Not applied'}
          hint={
            application?.status === 'approved'
              ? 'Your application has been approved'
              : application?.status === 'pending'
                ? 'Awaiting admin review'
                : application?.status === 'rejected'
                  ? 'Contact us for details'
                  : 'Apply from the sidebar'
          }
        />
        <StatCard
          icon={CreditCard}
          label="Subscription"
          value={application ? application.subscriptionStatus : '—'}
          hint="Set by the XCEED team"
        />
        <StatCard
          icon={Calendar}
          label="Account Since"
          value={
            account ? new Date(account.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : '—'
          }
        />
      </div>
    </main>
  );
}
