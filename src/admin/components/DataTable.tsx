import { useState } from 'react';
import { Pencil, Trash2, Search, Plus, FileX2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export type { Column };

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  searchable?: string[];
  filters?: TableFilter[];
  emptyMessage?: string;
  createLabel?: string;
  loading?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
  columns, data, onEdit, onDelete, onCreate, searchable, filters = [], emptyMessage = 'Belum ada data.', createLabel = 'Tambah', loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    filters.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
  );

  const filtered = data.filter(item => {
    const itemRecord = item as Record<string, unknown>;
    // Text search
    if (search && searchable) {
      const matchSearch = searchable.some(key => {
        const val = itemRecord[key];
        return String(val ?? '').toLowerCase().includes(search.toLowerCase());
      });
      if (!matchSearch) return false;
    }
    // Dropdown filters
    for (const f of filters) {
      const fv = filterValues[f.key];
      if (fv) {
        const val = String(itemRecord[f.key] ?? '');
        if (val !== fv) return false;
      }
    }
    return true;
  });

  const sorted = (() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      const mod = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * mod;
      }
      return (String(aVal).localeCompare(String(bVal))) * mod;
    });
  })();

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  function handleSort(key: string) {
    const col = columns.find(c => c.key === key);
    if (!col?.sortable) return;
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function handleFilterChange(key: string, value: string) {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function handleDelete(item: T) {
    if (onDelete) onDelete(item);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        {/* Search */}
        {searchable && (
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        )}
        {/* Dropdown Filters */}
        {filters.map(f => (
          <select
            key={f.key}
            value={filterValues[f.key]}
            onChange={e => handleFilterChange(f.key, e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            <option value="">{f.label}</option>
            {f.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> {createLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
          </div>
        ) : paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FileX2 size={48} className="mb-3" />
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">No</th>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 font-semibold text-slate-600 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-sky-600 transition-colors' : ''}`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-sky-600 font-bold">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </span>
                  </th>
                ))}
                {(onEdit || onDelete) && (() => {
                  const hasActionsCol = columns.some(c => c.key === 'actions');
                  return hasActionsCol ? null : <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">Aksi</th>;
                })()}
              </tr>
            </thead>
            <tbody>
              {paged.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {col.render ? col.render((item as Record<string, unknown>)[col.key], item) : String((item as Record<string, unknown>)[col.key] ?? '-')}
                    </td>
                  ))}
                  {columns.some(c => c.key === 'actions') ? null : (
                  <td className="px-4 py-3">
                    {onEdit || onDelete ? (
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ) : null}
                  </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>entri</span>
          </div>
          <span>Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, sorted.length)} dari {sorted.length}</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1]) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-sky-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
