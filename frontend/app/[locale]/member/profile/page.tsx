'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getMemberToken, getMyMemberProfile, updateMyMemberProfile } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Member, MemberProfileInput } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

const EMPTY: MemberProfileInput = {
  companyName: '',
  contactPerson: '',
  industry: '',
  products: '',
  location: '',
  mobileNumber: '',
  whatsappNumber: '',
  officeAddress: '',
};

export default function MemberProfilePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberProfileInput>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getMemberToken();
    if (!token) return;
    getMyMemberProfile(token)
      .then((res) => {
        setMember(res.data);
        setForm({
          companyName: res.data.companyName,
          contactPerson: res.data.contactPerson,
          industry: res.data.industry ?? '',
          products: res.data.products ?? '',
          location: res.data.location ?? '',
          mobileNumber: res.data.mobileNumber ?? '',
          whatsappNumber: res.data.whatsappNumber ?? '',
          officeAddress: res.data.officeAddress ?? '',
        });
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getMemberToken();
    if (!token) return;
    setSaving(true);
    try {
      await updateMyMemberProfile(token, form);
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
        <p className="text-sm text-brand-slate">Only you can edit this. Company status and subscription are managed by XCEED.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <label className={LABEL_CLASSES}>Email</label>
          <input value={member?.email ?? ''} disabled className={`${INPUT_CLASSES} bg-brand-mist text-brand-slate`} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES}>Company Name</label>
            <input required name="companyName" value={form.companyName} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
          <div>
            <label className={LABEL_CLASSES}>Contact Person</label>
            <input required name="contactPerson" value={form.contactPerson} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES}>Industry</label>
            <input name="industry" value={form.industry} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
          <div>
            <label className={LABEL_CLASSES}>Products / Services</label>
            <input name="products" value={form.products} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Location</label>
          <input name="location" value={form.location} onChange={handleChange} className={INPUT_CLASSES} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES}>Mobile Number</label>
            <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
          <div>
            <label className={LABEL_CLASSES}>WhatsApp Number</label>
            <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className={INPUT_CLASSES} />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Office Address</label>
          <textarea
            rows={3}
            name="officeAddress"
            value={form.officeAddress}
            onChange={handleChange}
            className={`${INPUT_CLASSES} resize-none`}
          />
        </div>

        <Button type="submit" disabled={saving} variant="primary" size="sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </Button>
      </form>
    </main>
  );
}
