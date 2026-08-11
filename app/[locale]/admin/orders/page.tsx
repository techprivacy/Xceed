'use client';

import { useState } from 'react';
import { Search, Trash2, Eye, ShoppingBag, Clock, Truck, CheckCircle2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import { useOrderList } from '@/lib/useOrderList';
import { ORDER_STATUS_TONE, ORDER_STATUS_LABELS } from '@/lib/orderStatus';
import { formatINR } from '@/lib/format';
import { Order } from '@/types';

export default function OrdersPage() {
  const { rows, loading, error, search, setSearch, page, setPage, pages, total, remove, load } = useOrderList();
  const [selected, setSelected] = useState<Order | null>(null);

  const newCount = rows.filter((o) => o.status === 'new').length;
  const processingCount = rows.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const deliveredCount = rows.filter((o) => o.status === 'delivered').length;

  return (
    <main className="p-6">
      <AdminPageHeader title="Orders" subtitle={`${total} order${total === 1 ? '' : 's'} placed via the storefront cart`} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={total} />
        <StatCard icon={Clock} label="New (this page)" value={newCount} />
        <StatCard icon={Truck} label="In Progress (this page)" value={processingCount} />
        <StatCard icon={CheckCircle2} label="Delivered (this page)" value={deliveredCount} />
      </div>

      <div className="mb-4 flex max-w-sm items-center rounded-full border border-brand-border bg-white px-4">
        <Search size={16} className="text-brand-slate" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, phone or email..."
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
        <DataTable
          keyField={(o) => o._id}
          rows={rows}
          emptyMessage={search ? 'No orders match your search.' : 'No orders placed yet.'}
          columns={[
            {
              header: 'Customer',
              accessor: (o) => (
                <>
                  <p className="font-semibold text-brand-black">{o.customerName}</p>
                  <p className="text-xs text-brand-slate">{o.companyName || o.mobileNumber}</p>
                </>
              ),
            },
            { header: 'Items', accessor: (o) => o.items.length },
            { header: 'Total', accessor: (o) => formatINR(o.grandTotal) },
            {
              header: 'Status',
              accessor: (o) => <Badge tone={ORDER_STATUS_TONE[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge>,
            },
            {
              header: 'Placed',
              accessor: (o) => <span className="text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>,
            },
            {
              header: '',
              accessor: (o) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelected(o)}
                    aria-label="View"
                    className="rounded-full p-1.5 text-brand-slate hover:bg-blue-50 hover:text-brand-blue"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => remove(o._id)}
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
      )}

      <ListPagination page={page} pages={pages} onChange={setPage} />

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated);
            load();
          }}
        />
      )}
    </main>
  );
}
