'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Trash2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useQuoteRequestList } from '@/lib/useQuoteRequestList';
import { STATUS_OPTIONS, STATUS_TONE, STATUS_LABELS } from '@/lib/quoteStatus';
import { QuoteStatus } from '@/types';

export default function QuotesListPage() {
  const [status, setStatus] = useState<QuoteStatus | ''>('');
  const { rows, loading, error, search, setSearch, page, setPage, pages, total, remove } = useQuoteRequestList({
    filters: { status: status || undefined },
    deleteConfirmMessage: 'Delete this quote request? This cannot be undone.',
    loadErrorMessage: 'Failed to load quote requests',
  });

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Bulk Quote CRM"
        subtitle={`${total} lead${total === 1 ? '' : 's'} captured from bulk quote requests`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          className="rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-black/5 bg-white px-4 py-8 text-center text-sm text-brand-slate">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-black/5 bg-white px-4 py-8 text-center text-sm text-red-600">
          {error}
        </div>
      ) : (
        <DataTable
          keyField={(q) => q._id}
          rows={rows}
          emptyMessage="No quote requests found."
          columns={[
            {
              header: 'Company',
              accessor: (q) => (
                <>
                  <Link href={`/admin/quotes/${q._id}`} className="font-semibold text-brand-red hover:underline">
                    {q.companyName}
                  </Link>
                  <p className="text-xs text-brand-slate">{q.city}</p>
                </>
              ),
            },
            {
              header: 'Contact',
              accessor: (q) => (
                <>
                  <p>{q.contactPerson || '—'}</p>
                  <p className="text-xs text-brand-slate">{q.mobileNumber}</p>
                </>
              ),
            },
            { header: 'Industry', accessor: (q) => q.industry || '—' },
            {
              header: 'Requirement',
              accessor: (q) => q.productRequirement,
              className: 'max-w-[220px] truncate',
            },
            {
              header: 'Sales Exec',
              accessor: (q) => (typeof q.salesExecutive === 'object' && q.salesExecutive ? q.salesExecutive.username : '—'),
            },
            {
              header: 'Status',
              accessor: (q) => <Badge tone={STATUS_TONE[q.status]}>{STATUS_LABELS[q.status]}</Badge>,
            },
            {
              header: 'Received',
              accessor: (q) => <span className="text-xs">{new Date(q.createdAt).toLocaleDateString('en-IN')}</span>,
            },
            {
              header: '',
              accessor: (q) => (
                <button
                  onClick={() => remove(q._id)}
                  aria-label="Delete"
                  className="rounded-full p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              ),
              className: 'text-right',
            },
          ]}
        />
      )}

      <ListPagination page={page} pages={pages} onChange={setPage} />
    </main>
  );
}
