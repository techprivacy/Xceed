import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import { MOCK_ACTIVITY_LOGS } from '@/lib/adminMockData';

export default function ActivityLogsPage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="Activity Logs" subtitle="Recent admin panel activity" />

      <DataTable
        keyField={(l) => l.id}
        rows={MOCK_ACTIVITY_LOGS}
        columns={[
          { header: 'User', accessor: (l) => <span className="font-semibold text-gray-900">{l.user}</span> },
          { header: 'Action', accessor: (l) => l.action },
          { header: 'Target', accessor: (l) => l.target },
          { header: 'Time', accessor: (l) => l.time },
        ]}
      />
      <p className="mt-3 text-xs text-gray-400">
        Showing demo data — real activity logging would capture every login, edit and status change automatically.
      </p>
    </main>
  );
}
