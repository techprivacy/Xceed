'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Package, Ban, Star, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getAdminToken, getProducts, deleteProduct, updateProduct } from '@/lib/api';
import { toast } from '@/lib/toast';
import { PRODUCT_CATEGORIES } from '@/lib/staticData';
import { Category, ConfiguratorType, Product } from '@/types';

const CONFIGURATOR_LABELS: Record<Exclude<ConfiguratorType, 'none'>, string> = {
  cast_letters: 'Cast Letters',
  cast_numbers: 'Cast Numbers',
  holder: 'Holder Configurator',
};

// Each tab is a dedicated management section for one storefront category —
// picking a tab shows only that category's products and links straight to
// the live page it feeds.
const CATEGORY_TABS = [{ apiSlug: 'all', urlSlug: '', title: 'All' }, ...PRODUCT_CATEGORIES];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // includeInactive so admins can see and re-enable disabled listings —
      // the storefront never passes this flag.
      const res = await getProducts({ limit: 100, includeInactive: true });
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

  const handleToggleActive = async (product: Product) => {
    const token = getAdminToken();
    if (!token) return;
    const next = product.isActive === false;
    setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, isActive: next } : p)));
    try {
      await updateProduct(token, product._id, { isActive: next });
      toast.success(`"${product.name}" is now ${next ? 'active' : 'inactive'}`);
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, isActive: !next } : p)));
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const byCategory = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => (typeof p.category === 'object' ? (p.category as Category).slug : '') === activeTab);
  }, [products, activeTab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((p) => {
      const categoryName = typeof p.category === 'object' ? (p.category as Category).name : '';
      return p.name.toLowerCase().includes(q) || categoryName.toLowerCase().includes(q);
    });
  }, [byCategory, search]);

  const outOfStock = products.filter((p) => !p.inStock).length;
  const bestSellers = products.filter((p) => p.isBestSeller).length;
  const activeTabEntry = CATEGORY_TABS.find((c) => c.apiSlug === activeTab);

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

      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-black/5 pb-3">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.apiSlug === 'all'
              ? products.length
              : products.filter((p) => (typeof p.category === 'object' ? (p.category as Category).slug : '') === tab.apiSlug)
                  .length;
          return (
            <button
              key={tab.apiSlug}
              type="button"
              onClick={() => setActiveTab(tab.apiSlug)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab.apiSlug
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-mist text-brand-slate hover:bg-brand-mist/70'
              }`}
            >
              {tab.title} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex max-w-sm flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none"
          />
        </div>
        {activeTabEntry && activeTabEntry.apiSlug !== 'all' && (
          <Link
            href={`/${activeTabEntry.urlSlug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
          >
            View live page <ExternalLink size={13} />
          </Link>
        )}
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
            {
              header: 'Product',
              accessor: (p) => (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-black">{p.name}</span>
                  {p.configuratorType && p.configuratorType !== 'none' && (
                    <Badge tone="blue">{CONFIGURATOR_LABELS[p.configuratorType]}</Badge>
                  )}
                </div>
              ),
            },
            {
              header: 'Category',
              accessor: (p) => (typeof p.category === 'object' ? (p.category as Category).name : '—'),
            },
            { header: 'Price', accessor: (p) => `₹${p.price.toLocaleString('en-IN')}` },
            {
              header: 'Stock',
              accessor: (p) =>
                p.inStock ? (
                  <Badge tone="green">In Stock</Badge>
                ) : (
                  <Badge tone="red">Out of Stock</Badge>
                ),
            },
            {
              header: 'Status',
              accessor: (p) => {
                const active = p.isActive !== false;
                return (
                  <button
                    type="button"
                    onClick={() => handleToggleActive(p)}
                    className="cursor-pointer"
                    aria-label={active ? 'Set inactive' : 'Set active'}
                  >
                    <Badge tone={active ? 'green' : 'gray'}>{active ? 'Active' : 'Inactive'}</Badge>
                  </button>
                );
              },
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
