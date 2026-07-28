'use client';

import { useState } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useSavedCartList } from '@/lib/useSavedCartList';
import { getAdminToken, updateSavedCart } from '@/lib/api';
import { toast } from '@/lib/toast';
import { SAVED_CART_STATUS_LABELS } from '@/lib/orderStatus';
import { formatINR } from '@/lib/format';
import { SavedCart, SavedCartStatus } from '@/types';

export default function SavedCartsPage() {
  const { rows, loading, error, search, setSearch, page, setPage, pages, total, remove, load } = useSavedCartList();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleStatusChange = async (cart: SavedCart, status: SavedCartStatus) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await updateSavedCart(token, cart._id, { status });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Saved Carts"
        subtitle={`${total} cart${total === 1 ? '' : 's'} saved for follow-up via "Save Cart"`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Bookmark} label="Total Saved Carts" value={total} />
      </div>

      <div className="mb-4 flex max-w-sm items-center rounded-full border border-brand-border bg-white px-4">
        <Search size={16} className="text-brand-slate" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email..."
          className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse border border-brand-border bg-brand-mist" />
          ))}
        </div>
      ) : (
        <>
          <DataTable
            keyField={(c) => c._id}
            rows={rows}
            emptyMessage={search ? 'No saved carts match your search.' : 'No carts have been saved yet.'}
            columns={[
              {
                header: 'Contact',
                accessor: (c) => (
                  <>
                    <p className="font-semibold text-brand-black">{c.name}</p>
                    <p className="text-xs text-brand-slate">{c.mobileNumber} · {c.email}</p>
                  </>
                ),
              },
              { header: 'Items', accessor: (c) => c.items.length },
              { header: 'Total', accessor: (c) => formatINR(c.grandTotal) },
              {
                header: 'Status',
                accessor: (c) => (
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c, e.target.value as SavedCartStatus)}
                    className="rounded-full border-0 bg-transparent text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    {(['new', 'contacted', 'converted'] as SavedCartStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {SAVED_CART_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                header: 'Saved',
                accessor: (c) => <span className="text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>,
              },
              {
                header: '',
                accessor: (c) => (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                      aria-label="Toggle items"
                      className="rounded-full p-1.5 text-brand-slate hover:bg-brand-mist"
                    >
                      {expanded === c._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                      onClick={() => remove(c._id)}
                      aria-label="Delete"
                      className="rounded-full p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ),
                className: 'text-right',
              },
            ]}
          />

          {rows
            .filter((c) => c._id === expanded)
            .map((c) => (
              <div key={c._id} className="mt-2 space-y-2 rounded-2xl border border-black/5 bg-white p-4">
                {c.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-brand-charcoal">
                      {item.name} <Badge tone="gray">x{item.quantity}</Badge>
                    </span>
                    <span className="font-semibold text-brand-black">{formatINR(item.total)}</span>
                  </div>
                ))}
              </div>
            ))}
        </>
      )}

      <ListPagination page={page} pages={pages} onChange={setPage} />
    </main>
  );
}
