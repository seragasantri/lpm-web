import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Rss, Eye, ExternalLink } from 'lucide-react';
import DataTable from '../../components/DataTable';
import type { Berita } from '../../../lib/types';
import { getBerita, deleteBerita } from '../../../lib/mockData';

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

export default function BeritaList() {
  useEffect(() => { document.title = 'Manajemen Berita :: LPM Admin'; }, []);
  const [data, setData] = useState<Berita[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBerita().then(d => {
      setData(d);
      // Load view counts from localStorage
      const counts: Record<string, number> = {};
      d.forEach(item => {
        counts[item.id] = parseInt(localStorage.getItem(`lpm_berita_views_${item.id}`) || '0');
      });
      setViewCounts(counts);
      setLoading(false);
    });
  }, []);

  const getViews = (id: string) => viewCounts[id] || 0;

  async function handleDelete(item: Berita) {
    if (confirm(`Hapus berita "${item.judul}"?`)) {
      await deleteBerita(item.id);
      setData(prev => prev.filter(x => x.id !== item.id));
    }
  }

  const columns = [
    {
      key: 'judul', label: 'Judul',
      render: (v: unknown) => <span className="font-semibold text-slate-800">{String(v)}</span>
    },
    {
      key: 'kategori', label: 'Kategori',
      render: (v: unknown) => {
        const cat = String(v);
        return <span className={`px-2 py-1 rounded-md text-xs font-medium ${kategoriColors[cat] || 'bg-slate-100 text-slate-600'}`}>{cat}</span>;
      }
    },
    { key: 'tanggal', label: 'Tanggal' },
    {
      key: 'status', label: 'Status',
      render: (v: unknown) => {
        const s = String(v);
        return <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[s] || 'bg-slate-100 text-slate-600'}`}>{s}</span>;
      }
    },
    {
      key: 'views', label: 'Dilihat',
      render: (_: unknown, item: Berita) => (
        <span className="flex items-center gap-1 text-sm text-slate-600 font-medium">
          <Eye size={14} className="text-slate-400" />
          {getViews(item.id)}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Aksi', render: (_: unknown, item: Berita) => (
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
                <span className="text-3xl font-black text-white">{data.length}</span>
              </div>
              <p className="text-sky-200 text-xs font-medium mt-1">Total Berita</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onCreate={() => navigate('/admin/berita/create')}
        searchable={['judul', 'kategori']}
        createLabel="Tambah Berita"
      />
    </div>
  );
}