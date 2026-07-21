'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { getAdminToken, getUsers } from '@/lib/api';
import { AdminUser } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    getUsers(token)
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6">
      <AdminPageHeader title="Users & Roles" subtitle="Admin panel accounts and access levels" />

      <DataTable
        keyField={(u) => u._id}
        rows={users}
        emptyMessage={loading ? 'Loading...' : 'No users found.'}
        columns={[
          { header: 'Username', accessor: (u) => <span className="font-semibold text-brand-black">{u.username}</span> },
          { header: 'Email', accessor: (u) => u.email || '—' },
          {
            header: 'Role',
            accessor: (u) => <StatusBadge label={u.role} tone={u.role === 'admin' ? 'blue' : 'gray'} />,
          },
        ]}
      />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-slate/70">
        <ShieldCheck size={13} /> This list is real data from the backend. Role-based permission editing (Sales
        Manager, Inventory Manager, etc.) isn't wired up yet.
      </p>
    </main>
  );
}
