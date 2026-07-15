'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, X, UploadCloud, Sparkles } from 'lucide-react';
import {
  getAdminToken,
  getCategories,
  createProduct,
  updateProduct,
  uploadProductImages,
  generateProductDescription,
  getAssetUrl,
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { Category, Product, ProductInput } from '@/types';

const PRICE_UNITS: { value: ProductInput['priceUnit']; label: string }[] = [
  { value: 'per_piece', label: 'Per Piece' },
  { value: 'per_letter', label: 'Per Letter' },
  { value: 'per_set', label: 'Per Set' },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(
    typeof product?.category === 'object' ? product.category._id : product?.category ?? ''
  );
  const [description, setDescription] = useState(product?.description ?? '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [priceUnit, setPriceUnit] = useState<ProductInput['priceUnit']>(
    product?.priceUnit ?? 'per_piece'
  );
  const [minOrderQty, setMinOrderQty] = useState(product?.minOrderQty?.toString() ?? '1');
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [isTrending, setIsTrending] = useState(product?.isTrending ?? false);
  const [tags, setTags] = useState(product?.tags?.join(', ') ?? '');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const token = getAdminToken();
    if (!token) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadProductImages(token, Array.from(files));
      setImages((prev) => [...prev, ...res.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((img) => img !== url));

  const handleGenerateDescription = async () => {
    const token = getAdminToken();
    if (!token || !name.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const categoryName = categories.find((c) => c._id === category)?.name;
      const res = await generateProductDescription(token, {
        name,
        categoryName,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        priceUnit,
      });
      setShortDescription(res.data.shortDescription);
      setDescription(res.data.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setError('');

    const payload: ProductInput = {
      name,
      slug,
      category,
      description,
      shortDescription,
      price: Number(price),
      priceUnit,
      minOrderQty: Number(minOrderQty) || 1,
      inStock,
      isBestSeller,
      isTrending,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images,
    };

    try {
      if (isEdit && product) {
        await updateProduct(token, product._id, payload);
        toast.success(`"${name}" updated`);
      } else {
        await createProduct(token, payload);
        toast.success(`"${name}" created`);
      }
      router.push('/admin/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
        <label className="mb-1 block text-xs font-semibold text-gray-600">Category</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-dashed border-brand-border/70 bg-blue-50/40 p-3">
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={generating || !name.trim()}
          className="flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-blue shadow-sm ring-1 ring-brand-blue/30 disabled:opacity-50"
        >
          {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          Generate with AI
        </button>
        <p className="mt-1.5 text-[11px] text-gray-500">
          Drafts a short description and full description from the product name, category, and tags.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Short Description</label>
        <input
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Price (₹)</label>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Price Unit</label>
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value as ProductInput['priceUnit'])}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {PRICE_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Min Order Qty</label>
          <input
            type="number"
            min={1}
            value={minOrderQty}
            onChange={(e) => setMinOrderQty(e.target.value)}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
          />
          Best Seller
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
          />
          Trending
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-brand-border">
              <Image src={getAssetUrl(url)} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-brand-border text-gray-400 hover:border-brand-blue hover:text-brand-blue">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            <span className="text-[10px]">Upload</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 rounded bg-gradient-to-r from-brand-blueDark to-brand-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded border border-brand-border px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
