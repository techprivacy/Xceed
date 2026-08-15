'use client';

import { Search, Trash2, Check, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useMembershipApplicationList } from '@/lib/useMembershipApplicationList';
import { getAdminToken, approveMembershipApplication, rejectMembershipApplication } from '@/lib/api';
import { toast } from '@/lib/toast';
import { MembershipApplication, ApplicationStatus } from '@/types';

const STATUS_TONE: Record<ApplicationStatus, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

const STATUS_FILTERS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

// Step 3 of "User Account -> Apply for Membership -> Membership Details ->
// Submit -> Admin Review -> Approved / Rejected". Separate from the "Users"
// page (app/admin/accounts) on purpose — see MembershipApplication.js and
// Account.js for why the two are split.
export default function MembershipApplicationsPage() {
  const { rows, loading, search, setSearch, status, setStatus, page, setPage, pages, total, remove, reload } =
    useMembershipApplicationList();

  const handleApprove = async (application: MembershipApplication) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await approveMembershipApplication(token, application._id);
      toast.success(`${application.companyName} approved`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (application: MembershipApplication) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm(`Reject ${application.companyName}'s application?`)) return;
    try {
      await rejectMembershipApplication(token, application._id);
      toast.success(`${application.companyName} rejected`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Membership Applications"
        subtitle={`${total} application${total === 1 ? '' : 's'} submitted`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact..."
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus | '')}
          className="rounded-full border border-brand-border bg-white px-4 py-2.5 text-sm"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        keyField={(a) => a._id}
        rows={rows}
        emptyMessage={loading ? 'Loading...' : 'No applications found.'}
        columns={[
          {
            header: 'Company',
            accessor: (a) => (
              <div>
                <p className="font-semibold text-brand-black">{a.companyName}</p>
                <p className="text-xs text-brand-slate">{a.contactPerson}</p>
              </div>
            ),
          },
          {
            header: 'Account Email',
            accessor: (a) => (typeof a.account === 'string' ? '—' : a.account.email),
          },
          { header: 'Industry', accessor: (a) => a.industry || '—' },
          { header: 'Status', accessor: (a) => <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge> },
          {
            header: 'Subscription',
            accessor: (a) => (
              <Badge tone={a.subscriptionStatus === 'active' ? 'green' : 'gray'}>{a.subscriptionStatus}</Badge>
            ),
          },
          {
            header: 'Actions',
            accessor: (a) => (
              <div className="flex items-center gap-1.5">
                {a.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(a)}
                      aria-label={`Approve ${a.companyName}`}
                      title="Approve"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 transition-colors hover:bg-green-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(a)}
                      aria-label={`Reject ${a.companyName}`}
                      title="Reject"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-red transition-colors hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
                <Link
                  href={`/admin/membership/${a._id}/edit`}
                  aria-label={`Edit ${a.companyName}`}
                  title="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-brand-mist hover:text-brand-charcoal"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(a._id)}
                  aria-label={`Delete ${a.companyName}`}
                  title="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-red-50 hover:text-brand-red"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <ListPagination page={page} pages={pages} onChange={setPage} />
    </main>
  );
}
