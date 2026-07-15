import { Users } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import { MOCK_CUSTOMERS } from '@/lib/adminMockData';

export default function CustomersPage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="Customers" subtitle={`${MOCK_CUSTOMERS.length} registered customers`} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Total Customers" value={MOCK_CUSTOMERS.length} />
      </div>

      <DataTable
        keyField={(c) => c.id}
        rows={MOCK_CUSTOMERS}
        columns={[
          { header: 'Company', accessor: (c) => <span className="font-semibold text-gray-900">{c.name}</span> },
          { header: 'City', accessor: (c) => c.city },
          { header: 'Orders', accessor: (c) => c.orders },
          { header: 'Total Spend', accessor: (c) => `₹${c.totalSpend.toLocaleString('en-IN')}` },
          { header: 'Customer Since', accessor: (c) => new Date(c.since).toLocaleDateString('en-IN') },
        ]}
      />
      <p className="mt-3 text-xs text-gray-400">
        Showing demo data — profiles, GST details, wishlists and order history would live here.
      </p>
    </main>
  );
}
