import { Inbox } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  // Hide this column in the mobile card layout — for columns that are
  // redundant there (e.g. an "Actions" column already rendered as the
  // card's own footer) or too wide to be useful stacked.
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

const SKELETON_ROWS = 5;

export default function DataTable<T>({
  columns,
  rows,
  keyField,
  emptyMessage = 'No records found.',
  loading = false,
}: DataTableProps<T>) {
  if (!loading && rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white px-6 py-16 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-mist text-brand-slate">
          <Inbox size={22} />
        </span>
        <p className="text-sm text-brand-slate">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop/tablet: real table, horizontal scroll only as a last
          resort if the viewport is genuinely too narrow for the columns. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm md:block">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-brand-mist text-left text-xs font-semibold uppercase tracking-wide text-brand-slate">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="border-t border-black/5">
                    {columns.map((col) => (
                      <td key={col.header} className="px-4 py-3.5">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-mist" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={keyField(row)} className="border-t border-black/5 transition-colors hover:bg-brand-mist/60">
                    {columns.map((col) => (
                      <td key={col.header} className={`px-4 py-3 text-brand-charcoal ${col.className ?? ''}`}>
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: each row becomes a card, columns stack as label/value
          pairs — no forced horizontal scroll on a phone. */}
      <div className="space-y-3 md:hidden">
        {loading
          ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="h-4 w-2/3 animate-pulse rounded bg-brand-mist" />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-brand-mist" />
              </div>
            ))
          : rows.map((row) => {
              const visibleColumns = columns.filter((c) => !c.hideOnMobile);
              return (
                <div key={keyField(row)} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  {visibleColumns.map((col, i) => (
                    <div
                      key={col.header}
                      className={`flex items-start justify-between gap-3 ${i > 0 ? 'mt-2.5 border-t border-black/5 pt-2.5' : ''}`}
                    >
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-slate">
                        {col.header}
                      </span>
                      <span className="min-w-0 text-right text-brand-charcoal">{col.accessor(row)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
      </div>
    </>
  );
}
