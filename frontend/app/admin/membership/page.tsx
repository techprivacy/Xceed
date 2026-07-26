'use client';

import Link from 'next/link';
import { Search, Trash2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useQuoteRequestList } from '@/lib/useQuoteRequestList';
import { STATUS_TONE, STATUS_LABELS } from '@/lib/quoteStatus';

export default function MembershipListPage() {
  const { rows, loading, error, search, setSearch, page, setPage, pages, total, remove } = useQuoteRequestList({
    filters: { productRequirement: 'Membership Application' },
    deleteConfirmMessage: 'Delete this membership application? This cannot be undone.',
    loadErrorMessage: 'Failed to load membership applications',
  });

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Membership Applications"
        subtitle={`${total} application${total === 1 ? '' : 's'} received via the Membership page`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, phone or email..."
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
          keyField={(m) => m._id}
          rows={rows}
          emptyMessage="No membership applications yet."
          columns={[
            {
              header: 'Applicant',
              accessor: (m) => (
                <>
                  <Link href={`/admin/quotes/${m._id}`} className="font-semibold text-brand-red hover:underline">
                    {m.contactPerson || m.companyName}
                  </Link>
                  <p className="text-xs text-brand-slate">{m.companyName}</p>
                </>
              ),
            },
            {
              header: 'Contact',
              accessor: (m) => (
                <>
                  <p>{m.mobileNumber}</p>
                  <p className="text-xs text-brand-slate">{m.email || '—'}</p>
                </>
              ),
            },
            {
              header: 'WhatsApp',
              accessor: (m) => m.whatsappNumber || '—',
            },
            {
              header: 'Location',
              accessor: (m) => (
                <>
                  <p>{m.city || '—'}</p>
                  <p className="text-xs text-brand-slate">{m.state || ''}</p>
                </>
              ),
            },
            {
              header: 'Status',
              accessor: (m) => <Badge tone={STATUS_TONE[m.status]}>{STATUS_LABELS[m.status]}</Badge>,
            },
            {
              header: 'Received',
              accessor: (m) => <span className="text-xs">{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>,
            },
            {
              header: '',
              accessor: (m) => (
                <button
                  onClick={() => remove(m._id)}
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
