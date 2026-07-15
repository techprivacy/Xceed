'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminToken, getQuoteRequests, deleteQuoteRequest } from '@/lib/api';
import { QuoteRequest, QuoteStatus } from '@/types';

const STATUS_OPTIONS: { value: QuoteStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const STATUS_STYLES: Record<QuoteStatus, string> = {
  new: 'bg-gray-100 text-gray-700',
  follow_up: 'bg-amber-100 text-amber-700',
  negotiation: 'bg-purple-100 text-purple-700',
  quotation_sent: 'bg-blue-100 text-brand-blue',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  follow_up: 'Follow Up',
  negotiation: 'Negotiation',
  quotation_sent: 'Quotation Sent',
  won: 'Won',
  lost: 'Lost',
};

export default function QuotesListPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<QuoteStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getQuoteRequests(token, { status, search, page, limit: 15 });
      setQuotes(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm('Delete this quote request? This cannot be undone.')) return;
    try {
      await deleteQuoteRequest(token, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Bulk Quote CRM</h1>
          <p className="text-sm text-gray-500">
            {total} lead{total === 1 ? '' : 's'} captured from bulk quote requests
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-lg border border-brand-border bg-white px-3">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by company, contact, phone or email..."
            className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as QuoteStatus | '');
          }}
          className="rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Requirement</th>
              <th className="px-4 py-3">Sales Exec</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && quotes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No quote requests found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              quotes.map((q) => (
                <tr key={q._id} className="border-t border-brand-border hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/quotes/${q._id}`}
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      {q.companyName}
                    </Link>
                    <p className="text-xs text-gray-500">{q.city}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <p>{q.contactPerson || '—'}</p>
                    <p className="text-xs text-gray-500">{q.mobileNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{q.industry || '—'}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-gray-700">
                    {q.productRequirement}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {typeof q.salesExecutive === 'object' && q.salesExecutive
                      ? q.salesExecutive.username
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[q.status]}`}
                    >
                      {STATUS_LABELS[q.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(q.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(q._id)}
                      aria-label="Delete"
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded border border-brand-border px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-gray-500">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="flex items-center gap-1 rounded border border-brand-border px-3 py-1.5 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </main>
  );
}
