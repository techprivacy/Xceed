'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, X, UploadCloud, Check } from 'lucide-react';
import {
  getAdminToken,
  getCategories,
  createProduct,
  updateProduct,
  uploadProductImages,
  getAssetUrl,
} from '@/lib/api';
import { toast } from '@/lib/toast';
import Button from '@/components/ui/Button';
import { Category, ConfiguratorType, HolderPriceMatrix, Product, ProductInput, SizePrice } from '@/types';

const PRICE_UNITS: { value: ProductInput['priceUnit']; label: string }[] = [
  { value: 'per_piece', label: 'Per Piece' },
  { value: 'per_letter', label: 'Per Letter' },
  { value: 'per_set', label: 'Per Set' },
];

const CONFIGURATOR_TYPES: { value: ConfiguratorType; label: string; hint: string }[] = [
  { value: 'none', label: 'Standard Product', hint: 'Regular catalog listing — no interactive builder.' },
  { value: 'cast_letters', label: 'Cast Letters Builder', hint: 'Powers the /cast-letters page — priced per size.' },
  { value: 'cast_numbers', label: 'Cast Numbers Builder', hint: 'Powers the /cast-numbers page — priced per size.' },
  { value: 'holder', label: 'Holder Configurator', hint: 'Powers the /holders page — letter price + holder price matrix.' },
];

const INSTALLATIONS: { key: string; label: string }[] = [
  { key: 'GLUE', label: 'Glue' },
  { key: 'SCREW', label: 'Screw' },
];
const CAPACITIES = [1, 2, 3, 4];

const DEFAULT_SIZE_PRICING: SizePrice[] = [
  { size: '5mm', price: 95 },
  { size: '6mm', price: 100 },
  { size: '7mm', price: 105 },
  { size: '8mm', price: 115 },
];

const DEFAULT_HOLDER_MATRIX: HolderPriceMatrix = {
  '5mm': { GLUE: { '1': 3900, '2': 4800, '3': 5200, '4': 5700 }, SCREW: { '1': 4000, '2': 5000, '3': 5300, '4': 5700 } },
  '6mm': { GLUE: { '1': 3950, '2': 4900, '3': 5350, '4': 5750 }, SCREW: { '1': 4050, '2': 5100, '3': 5500, '4': 5850 } },
  '7mm': { GLUE: { '1': 4000, '2': 5100, '3': 5400, '4': 5850 }, SCREW: { '1': 4050, '2': 5200, '3': 5600, '4': 5900 } },
  '8mm': { GLUE: { '1': 4050, '2': 5120, '3': 5420, '4': 5780 }, SCREW: { '1': 4100, '2': 5300, '3': 5600, '4': 5960 } },
};

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1.5 block text-xs font-semibold text-brand-charcoal';
const SECTION_CLASSES = 'rounded-2xl border border-black/5 bg-white p-6 shadow-sm';
const SECTION_TITLE_CLASSES = 'text-sm font-bold uppercase tracking-wide text-brand-slate';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function FormSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={SECTION_CLASSES}>
      <div className="mb-5">
        <h2 className={SECTION_TITLE_CLASSES}>{title}</h2>
        {hint && <p className="mt-1 text-xs text-brand-slate/80">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ToggleChip({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        checked
          ? 'border-brand-red/30 bg-brand-red/10 text-brand-red'
          : 'border-brand-border bg-white text-brand-slate hover:border-brand-red/20 hover:text-brand-red'
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
          checked ? 'border-brand-red bg-brand-red text-white' : 'border-brand-border bg-white'
        }`}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

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
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [isTrending, setIsTrending] = useState(product?.isTrending ?? false);
  const [tags, setTags] = useState(product?.tags?.join(', ') ?? '');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [configuratorType, setConfiguratorType] = useState<ConfiguratorType>(
    product?.configuratorType ?? 'none'
  );
  const [sizePricing, setSizePricing] = useState<SizePrice[]>(
    product?.sizePricing?.length ? product.sizePricing : DEFAULT_SIZE_PRICING
  );
  const [holderPriceMatrix, setHolderPriceMatrix] = useState<HolderPriceMatrix>(
    product?.holderPriceMatrix ?? DEFAULT_HOLDER_MATRIX
  );

  const updateSizePricing = (index: number, field: 'size' | 'price', value: string) => {
    setSizePricing((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: field === 'price' ? Number(value) : value } : row))
    );
  };

  const addSizeRow = () => setSizePricing((prev) => [...prev, { size: '', price: 0 }]);
  const removeSizeRow = (index: number) => setSizePricing((prev) => prev.filter((_, i) => i !== index));

  const setHolderMatrixValue = (size: string, installation: string, capacity: number, value: string) => {
    setHolderPriceMatrix((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [installation]: {
          ...prev[size]?.[installation],
          [capacity]: Number(value),
        },
      },
    }));
  };

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
      isActive,
      isBestSeller,
      isTrending,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images,
      configuratorType,
      ...(configuratorType !== 'none'
        ? { sizePricing: sizePricing.filter((row) => row.size.trim()) }
        : {}),
      ...(configuratorType === 'holder' ? { holderPriceMatrix } : {}),
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
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES}>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASSES} />
          </div>
          <div>
            <label className={LABEL_CLASSES}>Slug</label>
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${INPUT_CLASSES} bg-white`}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Short Description</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One line shown on product cards"
            className={INPUT_CLASSES}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES}>Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full description shown on the product page"
            className={`${INPUT_CLASSES} resize-none`}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES}>Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma, separated, tags"
            className={INPUT_CLASSES}
          />
        </div>
      </FormSection>

      <FormSection title="Pricing & Inventory">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={LABEL_CLASSES}>Price (₹)</label>
            <input
              required
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label className={LABEL_CLASSES}>Price Unit</label>
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value as ProductInput['priceUnit'])}
              className={`${INPUT_CLASSES} bg-white`}
            >
              {PRICE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASSES}>Min Order Qty</label>
            <input
              type="number"
              min={1}
              value={minOrderQty}
              onChange={(e) => setMinOrderQty(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES}>Visibility & Flags</label>
          <div className="flex flex-wrap gap-2.5">
            <ToggleChip checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Inactive'} />
            <ToggleChip checked={inStock} onChange={setInStock} label="In Stock" />
            <ToggleChip checked={isBestSeller} onChange={setIsBestSeller} label="Best Seller" />
            <ToggleChip checked={isTrending} onChange={setIsTrending} label="Trending" />
          </div>
          {!isActive && (
            <p className="mt-2 text-xs text-brand-slate">
              Inactive products are hidden from the storefront but stay editable here.
            </p>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Configurator"
        hint={CONFIGURATOR_TYPES.find((c) => c.value === configuratorType)?.hint}
      >
        <div>
          <label className={LABEL_CLASSES}>Configurator Type</label>
          <select
            value={configuratorType}
            onChange={(e) => setConfiguratorType(e.target.value as ConfiguratorType)}
            className={`${INPUT_CLASSES} bg-white`}
          >
            {CONFIGURATOR_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {configuratorType !== 'none' && (
          <div className="rounded-xl border border-brand-border/70 bg-brand-mist/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className={LABEL_CLASSES}>Letter/Number Price by Size</span>
              <button
                type="button"
                onClick={addSizeRow}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                + Add Size
              </button>
            </div>
            <div className="space-y-2.5">
              {sizePricing.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={row.size}
                    onChange={(e) => updateSizePricing(index, 'size', e.target.value)}
                    placeholder="e.g. 5mm"
                    className={`${INPUT_CLASSES} max-w-[120px] bg-white`}
                  />
                  <input
                    type="number"
                    min={0}
                    value={row.price}
                    onChange={(e) => updateSizePricing(index, 'price', e.target.value)}
                    placeholder="Price (₹)"
                    className={`${INPUT_CLASSES} bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSizeRow(index)}
                    aria-label="Remove size"
                    className="shrink-0 rounded-full p-1.5 text-brand-slate hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {configuratorType === 'holder' && (
          <div>
            <span className={LABEL_CLASSES}>Holder Price Matrix</span>
            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {sizePricing
                .filter((row) => row.size.trim())
                .map((row) => (
                  <div key={row.size} className="rounded-xl border border-brand-border/70 p-4">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-red">
                      {row.size} Holder Pricing
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-brand-slate">
                          <th className="pb-1.5">Capacity</th>
                          {INSTALLATIONS.map((inst) => (
                            <th key={inst.key} className="pb-1.5">
                              {inst.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {CAPACITIES.map((capacity) => (
                          <tr key={capacity}>
                            <td className="py-1 pr-2 text-xs font-semibold text-brand-charcoal">{capacity} Letter</td>
                            {INSTALLATIONS.map((inst) => (
                              <td key={inst.key} className="py-1 pr-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={holderPriceMatrix[row.size]?.[inst.key]?.[capacity] ?? 0}
                                  onChange={(e) => setHolderMatrixValue(row.size, inst.key, capacity, e.target.value)}
                                  className={`${INPUT_CLASSES} bg-white`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Images" hint="PNG, JPEG or WebP — the first image is used as the primary thumbnail.">
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border border-brand-border"
            >
              <Image src={getAssetUrl(url)} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-border text-brand-slate transition-colors hover:border-brand-red hover:text-brand-red">
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
            <span className="text-[10px] font-semibold">Upload</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>
        </div>
      </FormSection>

      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <Button type="submit" disabled={saving || uploading} variant="primary" size="sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
        <Button type="button" onClick={() => router.push('/admin/products')} variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    </form>
  );
}
