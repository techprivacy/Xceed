'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CategoryForm from '@/components/admin/CategoryForm';
import { getCategories } from '@/lib/api';
import { Category } from '@/types';

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCategories();
      const found = res.data.find((c) => c._id === id);
      if (!found) {
        setError('Category not found');
      } else {
        setCategory(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-6">
      <AdminPageHeader title="Edit Category" subtitle={category?.name} />
      {loading && <p className="text-sm text-brand-slate/70">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && category && <CategoryForm category={category} />}
    </main>
  );
}
