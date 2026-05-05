import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Rss, ExternalLink, Eye } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getBeritas, deleteBerita, type BeritaResponse } from '../../../lib/api';

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-slate-100 text-slate-600',
};

const kategoriColors: Record<string, string> = {
  Akreditasi: 'bg-blue-100 text-blue-700',
  SPMI: 'bg-purple-100 text-purple-700',
  'Inovasi Digital': 'bg-cyan-100 text-cyan-700',
  Sertifikasi: 'bg-amber-100 text-amber-700',
  ISO: 'bg-sky-100 text-sky-700',
};

// Helper function to get view count from localStorage
function getViews(id: number): number {
  return parseInt(localStorage.getItem(`lpm_berita_views_${id}`) || '0');
}

export default function BeritaList() {
  useEffect(() => { document.title = 'Manajemen Berita :: LPM Admin'; }, []);
  const [data, setData] = useState<BeritaResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBeritas({ per_page: 100 });
      // Handle both array response and object with data property
      const items = Array.isArray(result) ? result : (result?.data || []);
      setData(items);
      setTotal(Array.isArray(result) ? result.length : (result?.total || 0));
    } catch (err) {
      console.error('Error fetching berita:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(item: BeritaResponse) {
    if (confirm(`Hapus berita "${item.judul}"?`)) {
      try {
        await deleteBerita(item.id);
        setData(prev => prev.filter(x => x.id !== item.id));
        setTotal(prev => prev - 1);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus');
      }
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const columns = [
    {
      key: 'judul', label: 'Judul',
      render: (_: unknown, item: BeritaResponse) => <span className="font-semibold text-slate-800">{item.judul}</span>
    },
    {
      key: 'kategori', label: 'Kategori',
      render: (_: unknown, item: BeritaResponse) => {
        const catName = item.kategori?.nama || 'Lainnya';
        return <span className={`px-2 py-1 rounded-md text-xs font-medium ${kategoriColors[catName] || 'bg-slate-100 text-slate-600'}`}>{catName}</span>;
      }
    },
    {
      key: 'tanggal', label: 'Tanggal',
      render: (_: unknown, item: BeritaResponse) => formatDate(item.tanggal)
    },
    {
      key: 'status', label: 'Status',
      render: (_: unknown, item: BeritaResponse) => {
        const s = item.status;
        return <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[s] || 'bg-slate-100 text-slate-600'}`}>{s}</span>;
      }
    },
    {
      key: 'author', label: 'Author',
      render: (_: unknown, item: BeritaResponse) => (
        <span className="text-slate-500 text-sm">{item.author?.username || '-'}</span>
      ),
    },
    {
      key: 'views', label: 'Dilihat',
      render: (_: unknown, item: BeritaResponse) => (
        <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
          <Eye size={14} className="text-slate-400" />
          {getViews(item.id)}x
        </span>
      ),
    },
    {
      key: 'actions', label: 'Aksi', render: (_: unknown, item: BeritaResponse) => (
        <div className="flex items-center gap-2">
          <a
            href={`/berita/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Lihat di Website"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => navigate(`/admin/berita/edit/${item.id}`)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-8 px-6 mb-6 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FileText size={24} />
              <h1 className="text-2xl font-bold">Manajemen Berita</h1>
            </div>
            <p className="text-sky-100 text-sm ml-9">Kelola konten berita dan artikel website</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
              <div className="flex items-center gap-2">
                <Rss size={16} className="text-yellow-300" />
                <span className="text-3xl font-black text-white">{total}</span>
              </div>
              <p className="text-sky-200 text-xs font-medium mt-1">Total Berita</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700">
          <p className="font-semibold">Error: {error}</p>
          <button onClick={fetchData} className="mt-2 text-sm underline">Coba lagi</button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onCreate={() => navigate('/admin/berita/create')}
        onEdit={(item) => navigate(`/admin/berita/edit/${item.id}`)}
        onDelete={handleDelete}
        searchable={['judul']}
        createLabel="Tambah Berita"
      />
    </div>
  );
}