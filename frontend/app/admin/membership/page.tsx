'use client';

import { Search, Trash2, Check, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import { useMemberList } from '@/lib/useMemberList';
import { getAdminToken, approveMember, rejectMember } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Member, MemberStatus } from '@/types';

const STATUS_TONE: Record<MemberStatus, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red',
};

const STATUS_FILTERS: { value: MemberStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

// Replaces the old QuoteRequest-filtered "Membership Applications" view.
// Members are now a real collection (backend/src/models/Member.js) with a
// register -> pending -> admin approve/reject flow, so this manages that
// directly instead of reading quote-request rows tagged by product name.
export default function DirectoryPage() {
  const { rows, loading, search, setSearch, status, setStatus, page, setPage, pages, total, remove, reload } =
    useMemberList();

  const handleApprove = async (member: Member) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await approveMember(token, member._id);
      toast.success(`${member.companyName} approved — they can now log in.`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (member: Member) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm(`Reject ${member.companyName}'s application?`)) return;
    try {
      await rejectMember(token, member._id);
      toast.success(`${member.companyName} rejected`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  return (
    <main className="p-6">
      <AdminPageHeader title="Directory" subtitle={`${total} member${total === 1 ? '' : 's'} registered`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact, email..."
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as MemberStatus | '')}
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
        keyField={(m) => m._id}
        rows={rows}
        emptyMessage={loading ? 'Loading...' : 'No members found.'}
        columns={[
          {
            header: 'Company',
            accessor: (m) => (
              <div>
                <p className="font-semibold text-brand-black">{m.companyName}</p>
                <p className="text-xs text-brand-slate">{m.contactPerson}</p>
              </div>
            ),
          },
          { header: 'Email', accessor: (m) => m.email },
          { header: 'Industry', accessor: (m) => m.industry || '—' },
          { header: 'Status', accessor: (m) => <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge> },
          {
            header: 'Subscription',
            accessor: (m) => (
              <Badge tone={m.subscriptionStatus === 'active' ? 'green' : 'gray'}>{m.subscriptionStatus}</Badge>
            ),
          },
          {
            header: 'Actions',
            accessor: (m) => (
              <div className="flex items-center gap-1.5">
                {m.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(m)}
                      aria-label={`Approve ${m.companyName}`}
                      title="Approve"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 transition-colors hover:bg-green-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(m)}
                      aria-label={`Reject ${m.companyName}`}
                      title="Reject"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-red transition-colors hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
                <Link
                  href={`/admin/membership/${m._id}/edit`}
                  aria-label={`Edit ${m.companyName}`}
                  title="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-brand-mist hover:text-brand-charcoal"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(m._id)}
                  aria-label={`Delete ${m.companyName}`}
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
