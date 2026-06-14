import React, { useState, useMemo, type ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLight?: boolean;
  defaultSortKey?: keyof T;
  defaultSortDir?: 'asc' | 'desc';
  pageSize?: number;
  emptyMessage?: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLight = false,
  defaultSortKey,
  defaultSortDir = 'asc',
  pageSize = 0,
  emptyMessage = 'No data available.',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);
  const [page, setPage] = useState(0);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'string'
        ? (aVal as string).localeCompare(String(bVal))
        : Number(aVal) - Number(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;
  const pageData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;

  const handleSort = (col: Column<T>) => {
    if (col.sortable === false) return;
    if (sortKey === col.key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-xs font-mono border-collapse ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                onClick={() => handleSort(col)}
                className={`sticky top-0 z-10 px-3 py-3 text-left font-bold uppercase tracking-wider text-[10px] transition-colors duration-200 ${
                  col.sortable !== false ? 'cursor-pointer select-none hover:opacity-80' : ''
                } ${
                  isLight
                    ? 'bg-stone-200 text-stone-600 border-b-2 border-stone-300'
                    : 'bg-zinc-800 text-zinc-400 border-b-2 border-zinc-700'
                } ${col.className ?? ''}`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {sortKey === col.key && (
                    <span className="text-rose-500 text-[8px]">
                      {sortDir === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`px-3 py-8 text-center text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            pageData.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                className={`transition-colors duration-150 ${
                  isLight
                    ? `${rowIdx % 2 === 0 ? 'bg-stone-100/50' : 'bg-white/30'} hover:bg-rose-50/60`
                    : `${rowIdx % 2 === 0 ? 'bg-zinc-900/30' : 'bg-black/10'} hover:bg-rose-900/15`
                }`}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={`px-3 py-2.5 border-b ${
                      isLight ? 'border-stone-200/60' : 'border-zinc-800/30'
                    } ${col.className ?? ''}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between px-3 py-2 border-t ${
          isLight ? 'border-stone-200' : 'border-zinc-800'
        }`}>
          <span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-all duration-200 cursor-pointer active:scale-90 ${
                page === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : isLight
                    ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              ◀ PREV
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-all duration-200 cursor-pointer active:scale-90 ${
                page >= totalPages - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : isLight
                    ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              NEXT ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
