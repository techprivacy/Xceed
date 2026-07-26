'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getMembers, deleteMember, MemberListParams } from '@/lib/api';
import { Member } from '@/types';
import { toast } from '@/lib/toast';

// Mirrors useQuoteRequestList.ts's shape closely on purpose — same list page
// conventions (search/filter/paginate/delete), different resource.
export function useMemberList() {
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MemberListParams['status']>('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await getMembers(token, { status, search, page, limit: 15 });
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load directory');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const searchAndResetPage = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const filterByStatus = (value: MemberListParams['status']) => {
    setPage(1);
    setStatus(value);
  };

  const remove = async (id: string) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm('Delete this member? This cannot be undone.')) return;
    try {
      await deleteMember(token, id);
      toast.success('Member deleted');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return {
    rows,
    loading,
    search,
    setSearch: searchAndResetPage,
    status,
    setStatus: filterByStatus,
    page,
    setPage,
    pages,
    total,
    remove,
    reload: load,
  };
}
