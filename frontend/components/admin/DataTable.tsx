interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  keyField,
  emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-border bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={keyField(row)} className="border-t border-brand-border hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 text-gray-700 ${col.className ?? ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
