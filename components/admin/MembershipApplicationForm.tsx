'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminToken, updateMembershipApplication } from '@/lib/api';
import { toast } from '@/lib/toast';
import Button from '@/components/ui/Button';
import { MembershipApplication } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

// Admin-side edit for a MembershipApplication.
// No password/email field here: identity lives on the linked Account, not
// on the application itself.
export default function MembershipApplicationForm({ application }: { application: MembershipApplication }) {
  const router = useRouter();
  const accountEmail = typeof application.account === 'string' ? '' : application.account.email;

  const [companyName, setCompanyName] = useState(application.companyName);
  const [contactPerson, setContactPerson] = useState(application.contactPerson);
  const [industry, setIndustry] = useState(application.industry ?? '');
  const [products, setProducts] = useState(application.products ?? '');
  const [location, setLocation] = useState(application.location ?? '');
  const [country, setCountry] = useState(application.country ?? '');
  const [website, setWebsite] = useState(application.website ?? '');
  const [membershipType, setMembershipType] = useState(application.membershipType ?? '');
  const [status, setStatus] = useState(application.status);
  const [subscriptionStatus, setSubscriptionStatus] = useState(application.subscriptionStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      await updateMembershipApplication(token, application._id, {
        companyName,
        contactPerson,
        industry,
        products,
        location,
        country,
        website,
        membershipType,
        status,
        subscriptionStatus,
      });
      toast.success(`"${companyName}" updated`);
      router.push('/admin/membership');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save application';
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
        <label className={LABEL_CLASSES}>Account Email</label>
        <input value={accountEmail} disabled className={`${INPUT_CLASSES} bg-brand-mist text-brand-slate`} />
        <p className="mt-1 text-xs text-brand-slate">
          The applicant&apos;s login email — set on their Account, not editable here.
        </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={INPUT_CLASSES} />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className={INPUT_CLASSES} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Website</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className={INPUT_CLASSES} />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Membership Type</label>
          <select
            value={membershipType}
            onChange={(e) => setMembershipType(e.target.value as typeof membershipType)}
            className={INPUT_CLASSES}
          >
            <option value="">—</option>
            <option value="Indian Company">Indian Company</option>
            <option value="Japanese Company">Japanese Company</option>
            <option value="Foundry / Manufacturer">Foundry / Manufacturer</option>
            <option value="Technology / Machinery Supplier">Technology / Machinery Supplier</option>
            <option value="Industry Professional">Industry Professional</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MembershipApplication['status'])}
            className={INPUT_CLASSES}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLASSES}>Subscription</label>
          <select
            value={subscriptionStatus}
            onChange={(e) => setSubscriptionStatus(e.target.value as MembershipApplication['subscriptionStatus'])}
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
