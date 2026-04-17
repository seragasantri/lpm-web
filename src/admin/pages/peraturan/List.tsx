import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { useAuth } from '../../../context/AuthContext';
import { getPeraturan, deletePeraturan } from '../../../lib/mockData';
import type { Peraturan } from '../../../lib/types';
import { BookOpen, Plus } from 'lucide-react';

const KATEGORI_STYLES: Record<string, string> = {
  'Undang-Undang': 'bg-blue-100 text-blue-700',
  'Peraturan Pemerintah': 'bg-green-100 text-green-700',
  'Peraturan Presiden': 'bg-yellow-100 text-yellow-700',
  'Peraturan Menteri': 'bg-purple-100 text-purple-700',
  'Peraturan BAN-PT': 'bg-orange-100 text-orange-700',
};

export default function PeraturanList() {
  useEffect(() => { document.title = 'Manajemen peraturan :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<Peraturan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPeraturan().then(data => { setItems(data); setLoading(false); });
  }, []);

  const handleCreate = () => navigate('/admin/peraturan/create');
  const handleEdit = (item: Peraturan) => navigate(`/admin/peraturan/${item.id}/edit`);

  const handleDelete = async (item: Peraturan) => {
    if (!confirm('Yakin ingin menghapus peraturan ini?')) return;
    await deletePeraturan(item.id);
    setItems(prev => prev.filter(x => x.id !== item.id));
  };

  const columns = [
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: Peraturan) => (
        <span className="font-semibold text-slate-800">{item.judul}</span>
      ),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (val: unknown) => {
        const v = String(val ?? '');
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${KATEGORI_STYLES[v] ?? 'bg-slate-100 text-slate-600'}`}>
            {v}
          </span>
        );
      },
    },
    { key: 'nomor', label: 'Nomor' },
    { key: 'tahun', label: 'Tahun' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Peraturan</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola regulasi dan peraturan terkait penjaminan mutu</p>
          </div>
        </div>
        {hasPermission('peraturan.create') && (
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow">
            <Plus size={16} /> Tambah Peraturan
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={hasPermission('peraturan.create') ? handleCreate : undefined}
        searchable={['judul', 'kategori', 'nomor']}
        emptyMessage="Belum ada data peraturan."
        createLabel="Tambah Peraturan"
        loading={loading}
      />
    </div>
  );
}
