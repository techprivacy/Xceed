'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
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
      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && product && <ProductForm product={product} />}
    </main>
  );
}
