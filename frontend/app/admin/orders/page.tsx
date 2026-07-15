import { ShoppingCart, Clock, Truck, CheckCircle2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { MOCK_ORDERS } from '@/lib/adminMockData';

const STATUS_TONE: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'red'> = {
  Pending: 'gray',
  Processing: 'amber',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
};

export default function OrdersPage() {
  const pending = MOCK_ORDERS.filter((o) => o.status === 'Pending').length;
  const processing = MOCK_ORDERS.filter((o) => o.status === 'Processing').length;
  const delivered = MOCK_ORDERS.filter((o) => o.status === 'Delivered').length;

  return (
    <main className="p-6">
      <AdminPageHeader title="Orders" subtitle={`${MOCK_ORDERS.length} orders this month`} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Clock} label="Pending" value={pending} />
        <StatCard icon={Truck} label="Processing" value={processing} />
        <StatCard icon={CheckCircle2} label="Delivered" value={delivered} />
      </div>

      <DataTable
        keyField={(o) => o.id}
        rows={MOCK_ORDERS}
        columns={[
          { header: 'Order ID', accessor: (o) => <span className="font-semibold text-gray-900">{o.id}</span> },
          { header: 'Customer', accessor: (o) => o.customer },
          { header: 'Items', accessor: (o) => o.items },
          { header: 'Total', accessor: (o) => `₹${o.total.toLocaleString('en-IN')}` },
          { header: 'Status', accessor: (o) => <StatusBadge label={o.status} tone={STATUS_TONE[o.status]} /> },
          { header: 'Date', accessor: (o) => new Date(o.date).toLocaleDateString('en-IN') },
        ]}
      />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <ShoppingCart size={13} /> Showing demo data — invoicing, packing slips and courier integration would live here.
      </p>
    </main>
  );
}
