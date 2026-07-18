'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminToken, getQuoteRequests, deleteQuoteRequest } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { QuoteRequest, QuoteStatus } from '@/types';

const STATUS_TONE: Record<QuoteStatus, 'gray' | 'amber' | 'purple' | 'blue' | 'green' | 'red'> = {
  new: 'gray',
  follow_up: 'amber',
  negotiation: 'purple',
  quotation_sent: 'blue',
  won: 'green',
  lost: 'red',
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  follow_up: 'Follow Up',
  negotiation: 'Negotiation',
  quotation_sent: 'Quotation Sent',
  won: 'Won',
  lost: 'Lost',
};

export default function MembershipListPage() {
  const [members, setMembers] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const res = await getQuoteRequests(token, {
        productRequirement: 'Membership Application',
        search,
        page,
        limit: 15,
      });
      setMembers(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load membership applications');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm('Delete this membership application? This cannot be undone.')) return;
    try {
      await deleteQuoteRequest(token, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

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
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
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
          rows={members}
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
              accessor: (m) => <StatusBadge label={STATUS_LABELS[m.status]} tone={STATUS_TONE[m.status]} />,
            },
            {
              header: 'Received',
              accessor: (m) => <span className="text-xs">{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>,
            },
            {
              header: '',
              accessor: (m) => (
                <button
                  onClick={() => handleDelete(m._id)}
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

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded-full border border-brand-border px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-brand-slate">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="flex items-center gap-1 rounded-full border border-brand-border px-3 py-1.5 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </main>
  );
}
