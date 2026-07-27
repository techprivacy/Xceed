'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminToken, getProductById } from '@/lib/api';
import { Product } from '@/types';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await getProductById(token, id);
      setProduct(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-6">
      <AdminPageHeader title="Edit Product" subtitle={product?.name} />
      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-10 text-sm text-brand-slate">
          <Loader2 size={16} className="animate-spin" />
          Loading product...
        </div>
      )}
      {!loading && error && (
        <div className="rounded-2xl border border-black/5 bg-white px-4 py-8 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && product && <ProductForm product={product} />}
    </main>
  );
}
