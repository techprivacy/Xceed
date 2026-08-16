'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAdminToken, getNewsArticles, deleteNewsArticle, NewsListParams } from '@/lib/api';
import { NewsArticle } from '@/types';
import { toast } from '@/lib/toast';

// Same list page conventions as the rest of the admin panel
// (search/paginate/delete). includeDrafts is always true here since this
// is the admin list — it needs to see drafts, unlike the public pages.
export function useNewsList() {
  const [rows, setRows] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    try {
      const params: NewsListParams = { search, page, limit: 15, includeDrafts: true };
      const res = await getNewsArticles(params);
      setRows(res.data);
      setPages(res.pages ?? 1);
      setTotal(res.total ?? res.data.length);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load articles');
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
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deleteNewsArticle(token, id);
      toast.success('Article deleted');
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
    page,
    setPage,
    pages,
    total,
    remove,
    reload: load,
  };
}
