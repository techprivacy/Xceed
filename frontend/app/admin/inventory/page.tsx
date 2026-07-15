import { Boxes, AlertTriangle, Warehouse } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { MOCK_INVENTORY } from '@/lib/adminMockData';

const STATUS_TONE: Record<string, 'green' | 'amber' | 'red'> = {
  Healthy: 'green',
  'Low Stock': 'amber',
  'Out of Stock': 'red',
};

export default function InventoryPage() {
  const lowStock = MOCK_INVENTORY.filter((i) => i.status !== 'Healthy').length;

  return (
    <main className="p-6">
      <AdminPageHeader title="Inventory" subtitle="Live stock levels across warehouses" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Boxes} label="SKUs Tracked" value={MOCK_INVENTORY.length} />
        <StatCard icon={AlertTriangle} label="Needs Attention" value={lowStock} />
        <StatCard icon={Warehouse} label="Warehouses" value={2} />
      </div>

      <DataTable
        keyField={(i) => i.sku}
        rows={MOCK_INVENTORY}
        columns={[
          { header: 'SKU', accessor: (i) => <span className="font-semibold text-gray-900">{i.sku}</span> },
          { header: 'Warehouse', accessor: (i) => i.warehouse },
          { header: 'On Hand', accessor: (i) => i.onHand.toLocaleString('en-IN') },
          { header: 'Reserved', accessor: (i) => i.reserved.toLocaleString('en-IN') },
          { header: 'Reorder Level', accessor: (i) => i.reorderLevel.toLocaleString('en-IN') },
          { header: 'Status', accessor: (i) => <StatusBadge label={i.status} tone={STATUS_TONE[i.status]} /> },
        ]}
      />
      <p className="mt-3 text-xs text-gray-400">
        Showing demo data — hook this up to real stock movements, purchase entries and supplier records.
      </p>
    </main>
  );
}
