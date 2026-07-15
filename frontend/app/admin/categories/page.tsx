'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Plus, FolderTree, Pencil, Trash2, Search } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import { getAdminToken, getCategories, deleteCategory } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, name: string) => {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm(`Delete "${name}"? Products in this category will keep referencing it.`)) return;
    try {
      await deleteCategory(token, id);
      toast.success(`"${name}" deleted`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Categories"
        subtitle={`${categories.length} product categories`}
        action={
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-1.5 rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus size={14} /> Add Category
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FolderTree} label="Total Categories" value={categories.length} />
      </div>

      <div className="mb-4 flex max-w-sm items-center rounded-lg border border-brand-border bg-white px-3">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg border border-brand-border bg-gray-50"
            />
          ))}
        </div>
      ) : (
        <DataTable
          keyField={(c) => c._id}
          rows={filtered}
          emptyMessage={search ? 'No categories match your search.' : 'No categories found.'}
          columns={[
            { header: 'Category', accessor: (c) => <span className="font-semibold text-gray-900">{c.name}</span> },
            { header: 'Slug', accessor: (c) => c.slug },
            { header: 'Order', accessor: (c) => c.order ?? 0 },
            {
              header: '',
              accessor: (c) => (
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/categories/${c._id}/edit`}
                    aria-label="Edit"
                    className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-brand-blue"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(c._id, c.name)}
                    aria-label="Delete"
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
              className: 'text-right',
            },
          ]}
        />
      )}
    </main>
  );
}
