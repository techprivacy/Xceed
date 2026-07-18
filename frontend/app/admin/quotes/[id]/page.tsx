'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  MessageCircle,
  Paperclip,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  getAdminToken,
  getQuoteRequest,
  updateQuoteRequest,
  deleteQuoteRequest,
  addQuoteNote,
  uploadQuoteDrawing,
  emailQuotePdf,
  downloadQuotePdf,
  getUsers,
} from '@/lib/api';
import Button from '@/components/ui/Button';
import { AdminUser, QuoteRequest, QuoteStatus } from '@/types';

const STATUS_FLOW: { value: QuoteStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'won', label: 'Won' },
];

type EditableFields = Pick<
  QuoteRequest,
  | 'companyName'
  | 'gstNumber'
  | 'industry'
  | 'contactPerson'
  | 'email'
  | 'mobileNumber'
  | 'whatsappNumber'
  | 'city'
  | 'state'
  | 'officeAddress'
  | 'productRequirement'
  | 'quantity'
  | 'specialRequirement'
  | 'drawingUrl'
>;

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<EditableFields | null>(null);
  const [status, setStatus] = useState<QuoteStatus>('new');
  const [salesExecutive, setSalesExecutive] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [quoteRes, usersRes] = await Promise.all([
        getQuoteRequest(token, id),
        getUsers(token),
      ]);
      setQuote(quoteRes.data);
      setUsers(usersRes.data);
      const q = quoteRes.data;
      setForm({
        companyName: q.companyName,
        gstNumber: q.gstNumber ?? '',
        industry: q.industry ?? '',
        contactPerson: q.contactPerson ?? '',
        email: q.email ?? '',
        mobileNumber: q.mobileNumber,
        whatsappNumber: q.whatsappNumber ?? '',
        city: q.city ?? '',
        state: q.state ?? '',
        officeAddress: q.officeAddress ?? '',
        productRequirement: q.productRequirement,
        quantity: q.quantity ?? '',
        specialRequirement: q.specialRequirement ?? '',
        drawingUrl: q.drawingUrl ?? '',
      });
      setStatus(q.status);
      setSalesExecutive(typeof q.salesExecutive === 'object' ? q.salesExecutive?._id ?? '' : q.salesExecutive ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFieldChange = (field: keyof EditableFields, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    const token = getAdminToken();
    if (!token || !form) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await updateQuoteRequest(token, id, {
        ...form,
        status,
        salesExecutive: salesExecutive || undefined,
      });
      setQuote(res.data);
      setMessage('Saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm('Delete this quote request? This cannot be undone.')) return;
    await deleteQuoteRequest(token, id);
    router.push('/admin/quotes');
  };

  const handleAddNote = async () => {
    const token = getAdminToken();
    if (!token || !noteText.trim()) return;
    try {
      const res = await addQuoteNote(token, id, noteText.trim());
      setQuote(res.data);
      setNoteText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = getAdminToken();
    if (!file || !token) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadQuoteDrawing(token, file);
      handleFieldChange('drawingUrl', res.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownloadPdf = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await downloadQuotePdf(token, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  const handleEmailQuote = async () => {
    const token = getAdminToken();
    if (!token) return;
    setEmailing(true);
    setMessage('');
    setError('');
    try {
      const res = await emailQuotePdf(token, id);
      setMessage(res.message ?? 'Quotation emailed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to email quotation');
    } finally {
      setEmailing(false);
    }
  };

  const isMembership = quote?.productRequirement === 'Membership Application';
  const isContact = quote?.source === 'Contact Us';
  const backHref = isMembership ? '/admin/membership' : isContact ? '/admin/contact' : '/admin/quotes';
  const backLabel = isMembership
    ? 'Back to Membership Applications'
    : isContact
      ? 'Back to Contact Enquiries'
      : 'Back to Bulk Quote CRM';

  const whatsappHref = quote
    ? `https://wa.me/${quote.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hi ${quote.contactPerson || quote.companyName}, thank you for your bulk quote request for ${quote.productRequirement}. Our team at XCEED India will get back to you shortly with pricing.`
      )}`
    : '#';

  if (loading || !form) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-brand-slate">
        <Loader2 size={18} className="mr-2 animate-spin" /> Loading quote request...
      </main>
    );
  }

  if (!quote) {
    return <main className="p-6 text-sm text-red-600">{error || 'Quote not found.'}</main>;
  }

  const input = 'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue';
  const label = 'mb-1 block text-xs font-semibold text-brand-charcoal';

  return (
    <main className="p-6">
      <Link href={backHref} className="mb-4 inline-flex items-center gap-1.5 text-sm text-brand-slate hover:text-brand-red">
        <ArrowLeft size={15} /> {backLabel}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-black">{quote.companyName}</h1>
          <p className="text-xs text-brand-slate">
            Ref: {quote._id} · Received {new Date(quote.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 rounded-full border border-brand-blue px-3.5 py-2 text-xs font-semibold text-brand-blue hover:bg-blue-50"
          >
            <Download size={14} /> PDF
          </button>
          <button
            onClick={handleEmailQuote}
            disabled={emailing}
            className="flex items-center gap-1.5 rounded-full border border-brand-blue px-3.5 py-2 text-xs font-semibold text-brand-blue hover:bg-blue-50 disabled:opacity-50"
          >
            <Mail size={14} /> {emailing ? 'Sending...' : 'Email Quote'}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-green-600 px-3.5 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
          >
            <MessageCircle size={14} /> WhatsApp Quote
          </a>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="mb-6 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FLOW.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === s.value ? 'bg-brand-red text-white' : 'bg-brand-mist text-brand-charcoal hover:bg-brand-border'
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-brand-border" />
          <button
            onClick={() => setStatus('lost')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              status === 'lost' ? 'bg-brand-red text-white' : 'bg-brand-mist text-brand-charcoal hover:bg-brand-border'
            }`}
          >
            Lost
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-red">
              Company &amp; Contact
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Company Name</label>
                <input className={input} value={form.companyName} onChange={(e) => handleFieldChange('companyName', e.target.value)} />
              </div>
              <div>
                <label className={label}>GST Number</label>
                <input className={input} value={form.gstNumber} onChange={(e) => handleFieldChange('gstNumber', e.target.value)} />
              </div>
              <div>
                <label className={label}>Industry</label>
                <input className={input} value={form.industry} onChange={(e) => handleFieldChange('industry', e.target.value)} />
              </div>
              <div>
                <label className={label}>Contact Person</label>
                <input className={input} value={form.contactPerson} onChange={(e) => handleFieldChange('contactPerson', e.target.value)} />
              </div>
              <div>
                <label className={label}>Email</label>
                <input className={input} value={form.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
              </div>
              <div>
                <label className={label}>Phone</label>
                <input className={input} value={form.mobileNumber} onChange={(e) => handleFieldChange('mobileNumber', e.target.value)} />
              </div>
              <div>
                <label className={label}>WhatsApp Number</label>
                <input className={input} value={form.whatsappNumber} onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)} />
              </div>
              <div>
                <label className={label}>City</label>
                <input className={input} value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} />
              </div>
              <div>
                <label className={label}>State</label>
                <input className={input} value={form.state} onChange={(e) => handleFieldChange('state', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Office Address</label>
                <textarea
                  className={input}
                  rows={2}
                  value={form.officeAddress}
                  onChange={(e) => handleFieldChange('officeAddress', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-red">Requirement</h2>
            <div className="space-y-4">
              <div>
                <label className={label}>Products</label>
                <textarea className={input} rows={2} value={form.productRequirement} onChange={(e) => handleFieldChange('productRequirement', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Quantity</label>
                  <input className={input} value={form.quantity} onChange={(e) => handleFieldChange('quantity', e.target.value)} />
                </div>
                <div>
                  <label className={label}>Sales Executive</label>
                  <select
                    value={salesExecutive}
                    onChange={(e) => setSalesExecutive(e.target.value)}
                    className={input}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Special Requirement</label>
                <textarea className={input} rows={2} value={form.specialRequirement} onChange={(e) => handleFieldChange('specialRequirement', e.target.value)} />
              </div>
              <div>
                <label className={label}>Drawing / Attachment</label>
                <div className="flex flex-wrap items-center gap-3">
                  {form.drawingUrl && (
                    <a
                      href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${form.drawingUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                    >
                      <Paperclip size={13} /> View current file
                    </a>
                  )}
                  <label className="cursor-pointer rounded-full border border-brand-border px-3.5 py-1.5 text-xs font-semibold text-brand-charcoal hover:border-brand-slate">
                    {uploading ? 'Uploading...' : form.drawingUrl ? 'Replace file' : 'Upload file'}
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} variant="primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            {message && <p className="text-sm font-medium text-green-600">{message}</p>}
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-red">Internal Notes</h2>
            <div className="mb-4 max-h-72 space-y-3 overflow-y-auto">
              {quote.internalNotes.length === 0 && (
                <p className="text-xs text-brand-slate/70">No notes yet.</p>
              )}
              {[...quote.internalNotes].reverse().map((note) => (
                <div key={note._id} className="rounded-xl bg-brand-mist p-3 text-xs">
                  <p className="text-brand-charcoal">{note.text}</p>
                  <p className="mt-1 text-[10px] text-brand-slate/70">
                    {typeof note.addedBy === 'object' && note.addedBy ? note.addedBy.username : 'Admin'} ·{' '}
                    {new Date(note.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add an internal note..."
              rows={2}
              className={input}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="mt-2 w-full rounded-full border border-brand-blue py-2 text-xs font-semibold text-brand-blue hover:bg-blue-50 disabled:opacity-40"
            >
              Add Note
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
