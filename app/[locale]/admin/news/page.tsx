'use client';

import { Search, Trash2, Pencil, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DataTable from '@/components/admin/DataTable';
import ListPagination from '@/components/admin/ListPagination';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useNewsList } from '@/lib/useNewsList';
import { formatNewsDate } from '@/lib/newsIcons';

export default function AdminNewsPage() {
  const { rows, loading, search, setSearch, page, setPage, pages, total, remove } = useNewsList();

  return (
    <main className="p-6">
      <AdminPageHeader
        title="News"
        subtitle={`${total} article${total === 1 ? '' : 's'}`}
        action={
          <Link href="/admin/news/new">
            <Button variant="primary" size="sm">
              <Plus size={14} />
              New Article
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-brand-border bg-white px-4">
          <Search size={16} className="text-brand-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, category..."
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <DataTable
        keyField={(a) => a._id}
        rows={rows}
        emptyMessage={loading ? 'Loading...' : 'No articles found.'}
        columns={[
          {
            header: 'Title',
            accessor: (a) => (
              <div className="flex items-center gap-2">
                {a.featured && <Star size={14} className="shrink-0 fill-amber-400 text-amber-400" />}
                <p className="font-semibold text-brand-black">{a.title}</p>
              </div>
            ),
          },
          { header: 'Category', accessor: (a) => a.category },
          { header: 'Date', accessor: (a) => formatNewsDate(a.date) },
          {
            header: 'Status',
            accessor: (a) => <Badge tone={a.status === 'published' ? 'green' : 'gray'}>{a.status}</Badge>,
          },
          {
            header: 'Actions',
            accessor: (a) => (
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/news/${a._id}/edit`}
                  aria-label={`Edit ${a.title}`}
                  title="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-brand-mist hover:text-brand-charcoal"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(a._id)}
                  aria-label={`Delete ${a.title}`}
                  title="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-red-50 hover:text-brand-red"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <ListPagination page={page} pages={pages} onChange={setPage} />
    </main>
  );
}
