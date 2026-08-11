'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getQuoteRequests, deleteQuoteRequest, QuoteListParams } from '@/lib/api';
import { QuoteRequest } from '@/types';

type ListFilters = Omit<QuoteListParams, 'search' | 'page' | 'limit'>;

interface UseQuoteRequestListOptions {
  filters?: ListFilters;
  deleteConfirmMessage: string;
  loadErrorMessage: string;
}

export function useQuoteRequestList({ filters, deleteConfirmMessage, loadErrorMessage }: UseQuoteRequestListOptions) {
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // filters is represented via this stable string key so the effect only reruns
  // when its actual contents change, not on every render's new object identity.
  const filtersKey = JSON.stringify(filters ?? {});

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getQuoteRequests(token, { ...filters, search, page, limit: 15 });
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : loadErrorMessage);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, search, page, loadErrorMessage]);

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
    if (!confirm(deleteConfirmMessage)) return;
    try {
      await deleteQuoteRequest(token, id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return { rows, loading, error, search, setSearch: searchAndResetPage, page, setPage, pages, total, remove };
}
