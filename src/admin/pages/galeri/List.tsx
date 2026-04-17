import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Images } from 'lucide-react';
import DataTable from '../../components/DataTable';
import type { Galeri } from '../../../lib/types';
import { getGaleri, deleteGaleri } from '../../../lib/mockData';
import { useAuth } from '../../../context/AuthContext';

const KATEGORI_BADGE: Record<string, string> = {
  Audit: 'bg-blue-100 text-blue-700',
  Workshop: 'bg-green-100 text-green-700',
  Pelatihan: 'bg-amber-100 text-amber-700',
  Lainnya: 'bg-slate-100 text-slate-600',
};

export default function GaleriList() {
  useEffect(() => { document.title = 'Manajemen galeri :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getGaleri();
      setData(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: Galeri) => {
    await deleteGaleri(item.id);
    await load();
  };

  const columns = [
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: Galeri) => (
        <div className="flex items-center gap-3">
          {item.gambar ? (
            <img
              src={item.gambar}
              alt={item.judul}
              className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Images size={16} className="text-slate-400" />
            </div>
          )}
          <span className="font-semibold text-slate-800">{item.judul}</span>
        </div>
      ),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (_: unknown, item: Galeri) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${KATEGORI_BADGE[item.kategori] ?? 'bg-slate-100 text-slate-600'}`}>
          {item.kategori}
        </span>
      ),
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (_: unknown, item: Galeri) => (
        <span className="text-slate-500 text-sm">
          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Images size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Manajemen Galeri</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola foto dan dokumentasi kegiatan LPM</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['judul', 'kategori']}
          onCreate={hasPermission('galeri.create') ? () => navigate('/admin/galeri/create') : undefined}
          onEdit={(item) => navigate(`/admin/galeri/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Galeri"
          emptyMessage="Belum ada data galeri."
        />
      </div>
    </div>
  );
}
