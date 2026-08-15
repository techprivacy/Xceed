'use client';

import { useEffect, useState } from 'react';
import {
  Handshake,
  User,
  Building2,
  Phone,
  Globe2,
  Briefcase,
  Package,
  Link2,
  Factory,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { getAccountToken, getMyAccountProfile, submitMembershipApplication } from '@/lib/api';
import { MembershipType } from '@/types';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white py-3.5 pl-11 pr-4 text-base text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const EMPTY_FORM = {
  companyName: '',
  contactPerson: '',
  mobileNumber: '',
  country: '',
  industry: '',
  products: '',
  website: '',
};

// The membership-type selector — deliberately a set of tiles rather than a
// <select>, so choosing "who you are" reads as part of an application, not
// a generic account-settings field.
const MEMBERSHIP_TYPES: { value: MembershipType; icon: typeof User; label: string }[] = [
  { value: 'Indian Company', icon: Building2, label: 'Indian Company' },
  { value: 'Japanese Company', icon: Globe2, label: 'Japanese Company' },
  { value: 'Foundry / Manufacturer', icon: Factory, label: 'Foundry / Manufacturer' },
  { value: 'Technology / Machinery Supplier', icon: Settings, label: 'Technology / Machinery Supplier' },
  { value: 'Industry Professional', icon: User, label: 'Industry Professional' },
];

function IconField({ icon: Icon, children }: { icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-red" />
      {children}
    </div>
  );
}

// Step 2 of "User Account -> Apply for Membership -> ... -> Admin Review":
// this now requires an already-signed-in Account (see MembershipApplication
// on the backend) — no more email field here at all, identity comes from
// the logged-in account, and submission is authenticated rather than the
// old public registerMember. contactPerson still defaults to the account's
// own name but stays editable, since the on-the-ground contact for a
// company application isn't always the account holder.
export default function MembershipForm() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [accountEmail, setAccountEmail] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [membershipType, setMembershipType] = useState<MembershipType | ''>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = getAccountToken();
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    getMyAccountProfile(token)
      .then((res) => {
        setAccountEmail(res.data.email);
        setForm((prev) => ({ ...prev, contactPerson: prev.contactPerson || res.data.fullName }));
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membershipType) {
      setStatus('error');
      setErrorMsg('Please select which category you are joining as.');
      return;
    }
    const token = getAccountToken();
    if (!token) {
      setStatus('error');
      setErrorMsg('Please sign in first.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitMembershipApplication(token, { ...form, membershipType });
      setStatus('success');
      setForm(EMPTY_FORM);
      setMembershipType('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (checkingAuth) return null;

  if (!accountEmail) {
    return (
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white p-10 text-center shadow-xl">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
          <Handshake size={28} />
        </span>
        <h3 className="text-xl font-bold text-brand-black">Sign in to apply</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-slate">
          Membership applications are tied to an account. Create a free account first (instant, no approval
          wait), then come back here to apply.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="rounded-xl border border-brand-border px-6 py-3 text-sm font-bold text-brand-charcoal transition hover:bg-brand-mist"
          >
            Sign In
          </a>
          <a
            href="/member/register"
            className="rounded-xl bg-brand-red px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-redDark"
          >
            Create an Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">
      <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-brand-red to-brand-redDark px-6 py-8 text-center sm:px-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <Handshake size={28} />
        </span>
        <div>
          <h3 className="text-2xl font-bold text-white">Membership Application</h3>
          <p className="mt-1 text-sm text-white/80">
            Applying as {accountEmail} — our team will review your application.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 sm:p-10">
        <IconField icon={User}>
          <input
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            required
            placeholder="Contact Person*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Building2}>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            placeholder="Company Name*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Phone}>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile / WhatsApp*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Globe2}>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            placeholder="Country*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Briefcase}>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            required
            placeholder="Industry / Business Type*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Package}>
          <input
            name="products"
            value={form.products}
            onChange={handleChange}
            required
            placeholder="Products / Services*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Link2}>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website (optional)"
            className={INPUT_CLASSES}
          />
        </IconField>

        <div className="sm:col-span-2">
          <p className="mb-3 text-sm font-semibold text-brand-charcoal">I am joining as*</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MEMBERSHIP_TYPES.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMembershipType(value)}
                aria-pressed={membershipType === value}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 ${
                  membershipType === value
                    ? 'border-brand-red bg-brand-red/5 text-brand-red shadow-sm'
                    : 'border-brand-border bg-white text-brand-charcoal hover:border-brand-red/30 hover:bg-brand-mist'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    membershipType === value ? 'bg-brand-red/15 text-brand-red' : 'bg-brand-mist text-brand-slate'
                  }`}
                >
                  <Icon size={18} />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-brand-mist p-6 text-center sm:col-span-2">
          <h4 className="text-base font-bold uppercase tracking-wide text-brand-black">Why join XCEED?</h4>
          <p className="mt-2 text-sm font-semibold text-brand-slate">
            Business Connections &bull; Technology Discovery &bull; Supplier Network &bull; Japan&ndash;India
            Opportunities
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-redDark px-8 py-4 text-base font-semibold text-white shadow-md shadow-brand-red/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-red/30 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Membership'}
          <ArrowRight size={18} />
        </button>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600 sm:col-span-2">
            Thanks! Your application has been received. Our team will review it and update your membership status
            shortly — check My Membership in your account for updates.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
