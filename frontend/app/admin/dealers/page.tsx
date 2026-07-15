import { Building2, Plus } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { MOCK_DEALERS } from '@/lib/adminMockData';

export default function DealersPage() {
  return (
    <main className="p-6">
      <AdminPageHeader
        title="Dealers"
        subtitle={`${MOCK_DEALERS.length} registered dealers`}
        action={
          <button className="flex items-center gap-1.5 rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
            <Plus size={14} /> Register Dealer
          </button>
        }
      />

      <DataTable
        keyField={(d) => d.id}
        rows={MOCK_DEALERS}
        columns={[
          { header: 'Dealer', accessor: (d) => <span className="font-semibold text-gray-900">{d.name}</span> },
          { header: 'Territory', accessor: (d) => d.territory },
          { header: 'Discount', accessor: (d) => d.discount },
          { header: 'Credit Limit', accessor: (d) => `₹${d.creditLimit.toLocaleString('en-IN')}` },
          {
            header: 'Status',
            accessor: (d) => (
              <StatusBadge label={d.status} tone={d.status === 'Approved' ? 'green' : 'amber'} />
            ),
          },
        ]}
      />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <Building2 size={13} /> Showing demo data — approval workflow, dealer pricing and purchase history would live here.
      </p>
    </main>
  );
}
