'use client';

import { useEffect, useState } from 'react';
import { Building2, CreditCard, Calendar } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { getMemberToken, getMyMemberProfile } from '@/lib/api';
import { Member } from '@/types';

export default function MemberDashboardPage() {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const token = getMemberToken();
    if (!token) return;
    getMyMemberProfile(token)
      .then((res) => setMember(res.data))
      .catch(() => setMember(null));
  }, []);

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-brand-black">
          Welcome{member ? `, ${member.contactPerson}` : ''}
        </h1>
        <p className="text-sm text-brand-slate">{member?.companyName}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Membership Status"
          value={member ? 'Approved' : '—'}
          hint="Your application has been approved"
        />
        <StatCard
          icon={CreditCard}
          label="Subscription"
          value={member ? member.subscriptionStatus : '—'}
          hint="Set by the XCEED team"
        />
        <StatCard
          icon={Calendar}
          label="Member Since"
          value={member ? new Date(member.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : '—'}
        />
      </div>
    </main>
  );
}
