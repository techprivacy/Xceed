'use client';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useAccountList } from '@/lib/useAccountList';

// The "Users" page — every directly self-registered Account. No approval
// step, no status filter: that's the entire point of this being separate
// from Membership Applications (app/admin/membership). See Account.js /
// accountController.js for the backend side of this split.
export default function AccountsPage() {
  const { rows, loading, page, setPage, pages, total } = useAccountList();

  return (
    <main className="p-6">
      <AdminPageHeader title="Users" subtitle={`${total} account${total === 1 ? '' : 's'} registered`} />

      <DataTable
        keyField={(a) => a._id}
        rows={rows}
        emptyMessage={loading ? 'Loading...' : 'No users found.'}
        columns={[
          { header: 'Full Name', accessor: (a) => <p className="font-semibold text-brand-black">{a.fullName}</p> },
          { header: 'Email', accessor: (a) => a.email },
          {
            header: 'Email Verified',
            accessor: (a) => <Badge tone={a.emailVerified ? 'green' : 'amber'}>{a.emailVerified ? 'Verified' : 'Pending'}</Badge>,
          },
          {
            header: 'Registered',
            accessor: (a) => new Date(a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
          },
        ]}
      />

      <ListPagination page={page} pages={pages} onChange={setPage} />
    </main>
  );
}
