import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getQuickAccessItems, deleteQuickAccessItem } from '../../../lib/api';
import DataTable from '../../components/DataTable';
import type { QuickAccessResponse } from '../../../lib/api';
import { Link2, Plus, Loader, GripVertical, Eye, Edit, Trash2 } from 'lucide-react';

export default function QuickAccessIndex() {
  useEffect(() => { document.title = 'Menu Cepat :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<QuickAccessResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await getQuickAccessItems();
      setData(list);
    } catch (err) {
      console.error('Gagal memuat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (item: QuickAccessResponse) => {
    if (!confirm(`Hapus "${item.judul}"?`)) return;
    try {
      await deleteQuickAccessItem(item.id);
      await load();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const columns = [
    {
      key: 'urutan',
      label: 'Urutan',
      render: (_: unknown, item: QuickAccessResponse) => (
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-300" />
          <span className="font-semibold text-slate-700">{item.urutan}</span>
        </div>
      ),
    },
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: QuickAccessResponse) => (
        <div>
          <span className="font-semibold text-slate-800">{item.judul}</span>
          <p className="text-xs text-slate-500 mt-0.5">{item.deskripsi}</p>
        </div>
      ),
    },
    {
      key: 'link_url',
      label: 'Link',
      render: (_: unknown, item: QuickAccessResponse) => (
        <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 text-sm flex items-center gap-1">
          <Link2 size={14} /> {item.link_url}
        </a>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (_: unknown, item: QuickAccessResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {item.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Link2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Menu Cepat (Quick Access)</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola menu cepat di halaman utama</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['judul', 'deskripsi']}
          onCreate={hasPermission('quick-access.create') ? () => navigate('/admin/quick-access/create') : undefined}
          onEdit={(item) => navigate(`/admin/quick-access/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Menu"
          emptyMessage="Belum ada menu cepat."
        />
      </div>
    </div>
  );
}
