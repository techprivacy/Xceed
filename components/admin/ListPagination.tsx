import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListPaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export default function ListPagination({ page, pages, onChange }: ListPaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-sm">
      <button
        disabled={page <= 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="flex items-center gap-1 rounded-full border border-brand-border px-3 py-1.5 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="text-brand-slate">
        Page {page} of {pages}
      </span>
      <button
        disabled={page >= pages}
        onClick={() => onChange(Math.min(pages, page + 1))}
        className="flex items-center gap-1 rounded-full border border-brand-border px-3 py-1.5 disabled:opacity-40"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
