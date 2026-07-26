'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminToken, updateMember, AdminMemberUpdateInput } from '@/lib/api';
import { toast } from '@/lib/toast';
import Button from '@/components/ui/Button';
import { Member } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

// Admin-side edit only — a member's own profile edit is a separate, narrower
// form (app/member/profile/page.tsx) that can't touch status or subscription.
// There is no password field here: PUT /api/members/:id uses
// findByIdAndUpdate, which skips the model's hashing hook, so accepting a
// password on this path would store it in plain text (see memberController.js).
export default function MemberForm({ member }: { member: Member }) {
  const router = useRouter();

  const [companyName, setCompanyName] = useState(member.companyName);
  const [contactPerson, setContactPerson] = useState(member.contactPerson);
  const [industry, setIndustry] = useState(member.industry ?? '');
  const [products, setProducts] = useState(member.products ?? '');
  const [location, setLocation] = useState(member.location ?? '');
  const [status, setStatus] = useState(member.status);
  const [subscriptionStatus, setSubscriptionStatus] = useState(member.subscriptionStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setError('');

    const payload: AdminMemberUpdateInput = {
      companyName,
      contactPerson,
      industry,
      products,
      location,
      status,
      subscriptionStatus,
    };

    try {
      await updateMember(token, member._id, payload);
      toast.success(`"${companyName}" updated`);
      router.push('/admin/membership');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save member';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Company Name</label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Contact Person</label>
          <input
            required
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Email</label>
        <input value={member.email} disabled className={`${INPUT_CLASSES} bg-brand-mist text-brand-slate`} />
        <p className="mt-1 text-xs text-brand-slate">Email is the login and can&apos;t be changed here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Industry</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} className={INPUT_CLASSES} />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Products</label>
          <input value={products} onChange={(e) => setProducts(e.target.value)} className={INPUT_CLASSES} />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className={INPUT_CLASSES} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Member['status'])} className={INPUT_CLASSES}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLASSES}>Subscription</label>
          <select
            value={subscriptionStatus}
            onChange={(e) => setSubscriptionStatus(e.target.value as Member['subscriptionStatus'])}
            className={INPUT_CLASSES}
          >
            <option value="none">None</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} variant="primary" size="sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </Button>
        <Button type="button" onClick={() => router.push('/admin/membership')} variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    </form>
  );
}
