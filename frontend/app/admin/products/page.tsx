'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Package, Ban, Star, Pencil, Trash2, Search } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Button from '@/components/ui/Button';
import { getAdminToken, getProducts, deleteProduct } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Category, Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
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
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(token, id);
      toast.success(`"${name}" deleted`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const categoryName = typeof p.category === 'object' ? (p.category as Category).name : '';
      return p.name.toLowerCase().includes(q) || categoryName.toLowerCase().includes(q);
    });
  }, [products, search]);

  const outOfStock = products.filter((p) => !p.inStock).length;
  const bestSellers = products.filter((p) => p.isBestSeller).length;

  return (
    <main className="p-6">
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} products across all categories`}
        action={
          <Button href="/admin/products/new" size="sm">
            <Plus size={14} /> Add Product
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard icon={Star} label="Best Sellers" value={bestSellers} />
        <StatCard icon={Ban} label="Out of Stock" value={outOfStock} />
      </div>

      <div className="mb-4 flex max-w-sm items-center rounded-full border border-brand-border bg-white px-4">
        <Search size={16} className="text-brand-slate" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse border border-brand-border bg-brand-mist" />
          ))}
        </div>
      ) : (
        <DataTable
          keyField={(p) => p._id}
          rows={filtered}
          emptyMessage={search ? 'No products match your search.' : 'No products found.'}
          columns={[
            { header: 'Product', accessor: (p) => <span className="font-semibold text-brand-black">{p.name}</span> },
            {
              header: 'Category',
              accessor: (p) => (typeof p.category === 'object' ? (p.category as Category).name : '—'),
            },
            { header: 'Price', accessor: (p) => `₹${p.price.toLocaleString('en-IN')}` },
            {
              header: 'Status',
              accessor: (p) =>
                p.inStock ? (
                  <StatusBadge label="In Stock" tone="green" />
                ) : (
                  <StatusBadge label="Out of Stock" tone="red" />
                ),
            },
            {
              header: '',
              accessor: (p) => (
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${p._id}/edit`}
                    aria-label="Edit"
                    className="rounded-full p-1.5 text-brand-slate hover:bg-blue-50 hover:text-brand-blue"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.name)}
                    aria-label="Delete"
                    className="rounded-full p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
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
