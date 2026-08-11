'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getOrders, deleteOrder, OrderListParams } from '@/lib/api';
import { Order } from '@/types';

type ListFilters = Omit<OrderListParams, 'search' | 'page' | 'limit'>;

interface UseOrderListOptions {
  filters?: ListFilters;
}

export function useOrderList({ filters }: UseOrderListOptions = {}) {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const filtersKey = JSON.stringify(filters ?? {});

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getOrders(token, { ...filters, search, page, limit: 15 });
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, search, page]);

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
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
      await deleteOrder(token, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return { rows, loading, error, search, setSearch: searchAndResetPage, page, setPage, pages, total, remove, load };
}
