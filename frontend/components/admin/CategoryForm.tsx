'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminToken, createCategory, updateCategory, CategoryInput } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Category } from '@/types';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(category);

  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(category?.description ?? '');
  const [image, setImage] = useState(category?.image ?? '');
  const [order, setOrder] = useState(category?.order?.toString() ?? '0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setError('');

    const payload: CategoryInput = {
      name,
      slug,
      description,
      image,
      order: Number(order) || 0,
    };

    try {
      if (isEdit && category) {
        await updateCategory(token, category._id, payload);
        toast.success(`"${name}" updated`);
      } else {
        await createCategory(token, payload);
        toast.success(`"${name}" created`);
      }
      router.push('/admin/categories');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Image URL</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Display Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="rounded border border-brand-border px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
