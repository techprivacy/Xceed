'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsArticleForm from '@/components/admin/NewsArticleForm';
import { getAdminToken, getNewsArticleById } from '@/lib/api';
import { NewsArticle } from '@/types';

export default function EditNewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getNewsArticleById(token, id);
      setArticle(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-6">
      <AdminPageHeader title="Edit Article" subtitle={article?.title} />
      {loading && <p className="text-sm text-brand-slate/70">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && article && <NewsArticleForm article={article} />}
    </main>
  );
}
