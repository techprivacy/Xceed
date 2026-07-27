'use client';

import { useState } from 'react';
import { UserPlus, User, Building2, Mail, Lock, Phone, MessageCircle, MapPin, Briefcase, Package, ChevronDown, ShieldCheck, ArrowRight, ImagePlus } from 'lucide-react';
import { registerMember, uploadCompanyLogo } from '@/lib/api';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white py-3.5 pl-11 pr-4 text-base text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

const EMPTY_FORM = {
  fullName: '',
  companyName: '',
  email: '',
  password: '',
  industry: '',
  products: '',
  mobileNumber: '',
  whatsappNumber: '',
  city: '',
  state: '',
  officeAddress: '',
};

function IconField({
  icon: Icon,
  children,
}: {
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-red" />
      {children}
    </div>
  );
}

export default function MembershipForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      let companyLogo: string | undefined;
      if (logoFile) {
        const uploaded = await uploadCompanyLogo(logoFile);
        companyLogo = uploaded.data.url;
      }

      await registerMember({
        companyName: form.companyName,
        contactPerson: form.fullName,
        email: form.email,
        password: form.password,
        industry: form.industry,
        products: form.products,
        location: [form.city, form.state].filter(Boolean).join(', '),
        mobileNumber: form.mobileNumber,
        whatsappNumber: form.whatsappNumber,
        officeAddress: form.officeAddress,
        companyLogo,
      });
      setStatus('success');
      setForm(EMPTY_FORM);
      setLogoFile(null);
      setLogoPreview('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl">
      <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-brand-red to-brand-redDark px-6 py-8 text-center sm:px-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <UserPlus size={28} />
        </span>
        <div>
          <h3 className="text-2xl font-bold text-white">Become a Member Today</h3>
          <p className="mt-1 text-sm text-white/80">Fill in the form below to apply for membership.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 sm:p-10">
        <IconField icon={User}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="Full Name*"
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
        <IconField icon={Mail}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email Address*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Lock}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Create Password (min. 6 characters)*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Briefcase}>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            required
            placeholder="Industry*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Package}>
          <input
            name="products"
            value={form.products}
            onChange={handleChange}
            required
            placeholder="Products / Services You Offer*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={Phone}>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile Number*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={MessageCircle}>
          <input
            name="whatsappNumber"
            value={form.whatsappNumber}
            onChange={handleChange}
            required
            placeholder="WhatsApp No.*"
            className={INPUT_CLASSES}
          />
        </IconField>
        <IconField icon={MapPin}>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="City*"
            className={INPUT_CLASSES}
          />
        </IconField>

        <div className="relative sm:col-span-2">
          <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-red" />
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className={`${INPUT_CLASSES} appearance-none pr-10 ${form.state ? '' : 'text-brand-slate'}`}
          >
            <option value="" disabled>
              State*
            </option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state} className="text-brand-charcoal">
                {state}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-slate" />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-charcoal">
            <ImagePlus size={16} className="text-brand-red" />
            Company Logo (optional)
          </label>
          <div className="flex items-center gap-4">
            {logoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="h-14 w-14 shrink-0 rounded-xl border border-brand-border object-contain p-1"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-brand-slate file:mr-4 file:rounded-full file:border-0 file:bg-brand-red/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-redDark hover:file:bg-brand-red/20"
            />
          </div>
        </div>

        <div className="relative sm:col-span-2">
          <Building2 size={18} className="pointer-events-none absolute left-4 top-4 text-brand-red" />
          <textarea
            name="officeAddress"
            value={form.officeAddress}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Office Address*"
            className={`${INPUT_CLASSES} resize-none pt-3.5`}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-redDark px-8 py-4 text-base font-semibold text-white shadow-md shadow-brand-red/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-red/30 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Membership Application'}
          <ArrowRight size={18} />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs italic text-brand-slate sm:col-span-2">
          <ShieldCheck size={13} className="shrink-0 text-brand-red" />
          Our team will contact you within 24 hours to confirm your membership.
        </p>

        {status === 'success' && (
          <p className="text-sm font-medium text-green-600 sm:col-span-2">
            Thanks! Your application has been received. Once approved, you can log in with the email
            and password above at the Member Portal.
          </p>
        )}
        {status === 'error' && <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMsg}</p>}
      </form>
    </div>
  );
}
