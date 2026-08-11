'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getAdminToken, getUsers, updateUser, deleteUser } from '@/lib/api';
import { toast } from '@/lib/toast';
import { useCurrentAdmin } from '@/lib/useCurrentAdmin';
import { ASSIGNABLE_ROLES, ROLE_LABELS } from '@/lib/permissions';
import { AdminUser, AdminRole } from '@/types';

export default function UsersPage() {
  const { admin: currentAdmin } = useCurrentAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    getUsers(token)
      .then((res) => setUsers(res.data))
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (user: AdminUser, role: AdminRole) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await updateUser(token, user._id, { role });
      toast.success(`${user.username}'s role updated to ${ROLE_LABELS[role]}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleDelete = async (user: AdminUser) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm(`Delete the account "${user.username}"? This cannot be undone.`)) return;
    try {
      await deleteUser(token, user._id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  // Only 'admin' can create/edit/delete accounts — matches the backend, which
  // gates POST/PUT/DELETE /api/auth/users on adminOnly regardless of what this
  // page shows.
  const isSuperAdmin = currentAdmin?.role === 'admin';

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Users & Roles"
        subtitle="Admin panel accounts and access levels"
        action={
          isSuperAdmin ? (
            <Button href="/admin/users/new" size="sm">
              <Plus size={14} /> New User
            </Button>
          ) : undefined
        }
      />

      <DataTable
        keyField={(u) => u._id}
        rows={users}
        emptyMessage={loading ? 'Loading...' : 'No users found.'}
        columns={[
          { header: 'Username', accessor: (u) => <span className="font-semibold text-brand-black">{u.username}</span> },
          { header: 'Email', accessor: (u) => u.email || '—' },
          {
            header: 'Role',
            accessor: (u) =>
              u.role === 'admin' ? (
                <Badge tone="blue">Admin</Badge>
              ) : isSuperAdmin ? (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u, e.target.value as AdminRole)}
                  className="rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-semibold text-brand-charcoal"
                >
                  {ASSIGNABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge tone="gray">{ROLE_LABELS[u.role]}</Badge>
              ),
          },
          {
            header: '',
            accessor: (u) =>
              isSuperAdmin &&
              u.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => handleDelete(u)}
                  aria-label={`Delete ${u.username}`}
                  className="rounded-full p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              ),
            className: 'text-right',
          },
        ]}
      />

      <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-slate/70">
        <ShieldCheck size={13} /> Admin accounts can&apos;t be edited or deleted here — that&apos;s set directly in
        the database on purpose, so a compromised admin session can&apos;t mint more admins through this screen.
      </p>
    </main>
  );
}
