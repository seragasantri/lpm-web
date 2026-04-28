import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Images, Eye } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { getGaleris, deleteGaleri, type GaleriResponse } from '../../../lib/api';
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
  const [data, setData] = useState<GaleriResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getGaleris({ per_page: 100 });
      setData(Array.isArray(result) ? result : result.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: GaleriResponse) => {
    if (confirm(`Hapus galeri "${item.judul}"?`)) {
      try {
        await deleteGaleri(item.id);
        await load();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal menghapus');
      }
    }
  };

  const getGambarUrl = (gambar: string) => {
    if (!gambar) return '';
    return `${gambar}`;
  };

  const columns = [
    {
      key: 'gambar',
      label: 'Preview',
      sortable: false,
      render: (_: unknown, item: GaleriResponse) => (
        <div className="flex items-center gap-2">
          {item.gambar ? (
            <>
              <img
                src={getGambarUrl(item.gambar)}
                alt={item.judul}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100 cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                onClick={() => setPreviewImage(getGambarUrl(item.gambar))}
              />
              <button
                onClick={() => setPreviewImage(getGambarUrl(item.gambar))}
                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                title="Lihat gambar"
              >
                <Eye size={16} />
              </button>
            </>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Images size={18} className="text-slate-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: GaleriResponse) => (
        <span className="font-semibold text-slate-800">{item.judul}</span>
      ),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (_: unknown, item: GaleriResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${KATEGORI_BADGE[item.kategori] ?? 'bg-slate-100 text-slate-600'}`}>
          {item.kategori}
        </span>
      ),
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (_: unknown, item: GaleriResponse) => (
        <span className="text-slate-500 text-sm">
          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
      )}

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
