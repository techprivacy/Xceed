'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminToken, createNewsArticle, updateNewsArticle } from '@/lib/api';
import { toast } from '@/lib/toast';
import Button from '@/components/ui/Button';
import { NewsArticle, NewsIcon, NewsStatus } from '@/types';
import { NEWS_ICON_OPTIONS } from '@/lib/newsIcons';

const INPUT_CLASSES =
  'w-full rounded-xl border border-brand-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20';
const LABEL_CLASSES = 'mb-1 block text-xs font-semibold text-brand-charcoal';

interface NewsArticleFormProps {
  article?: NewsArticle;
}

// Create when no `article` is passed, edit when one is — same dual-mode
// pattern as ProductForm.tsx.
export default function NewsArticleForm({ article }: NewsArticleFormProps) {
  const router = useRouter();
  const isEdit = Boolean(article);

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [category, setCategory] = useState(article?.category ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [body, setBody] = useState(article?.body ?? '');
  const [date, setDate] = useState(article ? article.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [icon, setIcon] = useState<NewsIcon>(article?.icon ?? 'Newspaper');
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [status, setStatus] = useState<NewsStatus>(article?.status ?? 'published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    if (!title || !category || !excerpt || !body) {
      setError('Title, category, excerpt, and body are all required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title,
      slug: slug || undefined,
      category,
      excerpt,
      body,
      date: new Date(date).toISOString(),
      icon,
      featured,
      status,
    };

    try {
      if (isEdit && article) {
        await updateNewsArticle(token, article._id, payload);
        toast.success(`"${title}" updated`);
      } else {
        await createNewsArticle(token, payload);
        toast.success(`"${title}" created`);
      }
      router.push('/admin/news');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save article';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div>
        <label className={LABEL_CLASSES}>Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_CLASSES} />
      </div>

      <div>
        <label className={LABEL_CLASSES}>Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Leave blank to auto-generate from the title"
          className={INPUT_CLASSES}
        />
        <p className="mt-1 text-xs text-brand-slate">Used in the article's URL — auto-generated from the title if left blank.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Category</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Technology, Partnership, Company"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Excerpt</label>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={INPUT_CLASSES}
        />
        <p className="mt-1 text-xs text-brand-slate">Short summary shown on the News & Awards and All News cards.</p>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Body</label>
        <textarea
          required
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={INPUT_CLASSES}
        />
        <p className="mt-1 text-xs text-brand-slate">Separate paragraphs with a blank line.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASSES}>Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value as NewsIcon)} className={INPUT_CLASSES}>
            {NEWS_ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASSES}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as NewsStatus)} className={INPUT_CLASSES}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-charcoal">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Feature this article (shows in the Featured News slot — unfeatures any other article)
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} variant="primary" size="sm">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Article'}
        </Button>
        <Button type="button" onClick={() => router.push('/admin/news')} variant="ghost" size="sm">
          Cancel
        </Button>
      </div>
    </form>
  );
}
