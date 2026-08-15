'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getAccountToken, getMyAccountProfile, updateMyAccountProfile, getMyMembershipApplication } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Account, MembershipApplication } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

// Only Account fields live here now (fullName/email) — company-level
// details (companyName, industry, products, etc.) belong to a
// MembershipApplication, a separate thing an account may or may not have.
export default function MemberProfilePage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAccountToken();
    if (!token) return;
    getMyAccountProfile(token)
      .then((res) => {
        setAccount(res.data);
        setFullName(res.data.fullName);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
    getMyMembershipApplication(token)
      .then((res) => setApplication(res.data))
      .catch(() => setApplication(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccountToken();
    if (!token) return;
    setSaving(true);
    try {
      await updateMyAccountProfile(token, { fullName });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6 text-sm text-brand-slate">Loading...</main>;

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-brand-black">Your Profile</h1>
        <p className="text-sm text-brand-slate">Your account details. Only you can edit this.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <label className={LABEL_CLASSES}>Email</label>
          <input value={account?.email ?? ''} disabled className={`${INPUT_CLASSES} bg-brand-mist text-brand-slate`} />
        </div>

        <div>
          <label className={LABEL_CLASSES}>Full Name</label>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={INPUT_CLASSES} />
        </div>

        <Button type="submit" disabled={saving} variant="primary" size="sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </Button>
      </form>

      <div className="mt-6 max-w-xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-black">Membership Application</h2>
        {application ? (
          <>
            <p className="mt-2 text-sm text-brand-slate">
              {application.companyName} —{' '}
              <span className="font-semibold capitalize text-brand-charcoal">{application.status}</span>
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              Company details are reviewed by the XCEED team — contact us if anything needs correcting.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-brand-slate">You haven&apos;t applied for membership yet.</p>
            <Link href="/membership/register" className="mt-3 inline-block text-sm font-semibold text-brand-red hover:underline">
              Apply for Membership
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
