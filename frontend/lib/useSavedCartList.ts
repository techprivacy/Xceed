'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getSavedCarts, deleteSavedCart, SavedCartListParams } from '@/lib/api';
import { SavedCart } from '@/types';

export function useSavedCartList() {
  const [rows, setRows] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params: SavedCartListParams = { search, page, limit: 15 };
      const res = await getSavedCarts(token, params);
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved carts');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const searchAndResetPage = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const remove = async (id: string) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm('Delete this saved cart? This cannot be undone.')) return;
    try {
      await deleteSavedCart(token, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return { rows, loading, error, search, setSearch: searchAndResetPage, page, setPage, pages, total, remove, load };
}
