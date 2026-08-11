'use client';

import Link from 'next/link';
import { Search, Trash2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useQuoteRequestList } from '@/lib/useQuoteRequestList';
import { STATUS_TONE, STATUS_LABELS } from '@/lib/quoteStatus';

export default function ContactEnquiriesPage() {
  const { rows, loading, error, search, setSearch, page, setPage, pages, total, remove } = useQuoteRequestList({
    filters: { source: 'Contact Us' },
    deleteConfirmMessage: 'Delete this contact enquiry? This cannot be undone.',
    loadErrorMessage: 'Failed to load contact enquiries',
  });

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Contact Enquiries"
        subtitle={`${total} enquir${total === 1 ? 'y' : 'ies'} received via the Contact Us page`}
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
          emptyMessage="No contact enquiries yet."
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
            {
              header: 'Message',
              accessor: (q) => q.productRequirement,
              className: 'max-w-[260px] truncate',
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
