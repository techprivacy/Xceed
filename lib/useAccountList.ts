'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getAccounts } from '@/lib/api';
import { Account } from '@/types';
import { toast } from '@/lib/toast';

// The "Users" list — directly self-registered accounts, no approval concept
// at all (contrast with useMembershipApplicationList.ts). There's no
// admin delete/edit endpoint for accounts yet, so this is read-only:
// search + paginate only.
export function useAccountList() {
  const [rows, setRows] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAccounts(token, { page, limit: 15 });
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, loading, page, setPage, pages, total, reload: load };
}
