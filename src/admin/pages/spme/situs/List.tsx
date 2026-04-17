import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { getSitus, deleteSitus } from '../../../../lib/mockData';
import { useAuth } from '../../../../context/AuthContext';

const KATEGORI_STYLES: Record<string, string> = {
  Akreditasi: 'bg-blue-100 text-blue-700',
  'E-Learning': 'bg-green-100 text-green-700',
  Perpustakaan: 'bg-purple-100 text-purple-700',
  'Perguruan Tinggi': 'bg-yellow-100 text-yellow-700',
  Lainnya: 'bg-slate-100 text-slate-700',
};

interface SitusItem {
  id: string;
  nama: string;
  deskripsi: string;
  url: string;
  kategori: string;
  icon: string;
  urutan: number;
  createdAt: string;
}

export default function SpmeSitusList() {
  useEffect(() => { document.title = 'Situs Terkait :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<SitusItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getSitus();
      setData(list.sort((a, b) => a.urutan - b.urutan));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: SitusItem) => {
    await deleteSitus(item.id);
    await load();
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama Situs',
      render: (_: unknown, item: SitusItem) => (
        <div>
          <p className="font-semibold text-slate-800">{item.nama}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sky-500 text-xs hover:text-sky-600 truncate block max-w-xs">
            {item.url}
          </a>
        </div>
      ),
    },
    {
      key: 'deskripsi',
      label: 'Deskripsi',
      render: (val: unknown) => (
        <span className="text-slate-600 text-sm line-clamp-1">{String(val ?? '')}</span>
      ),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (val: unknown) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${KATEGORI_STYLES[String(val ?? '')] ?? 'bg-slate-100 text-slate-600'}`}>
          {String(val ?? '')}
        </span>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (val: unknown) => (
        <span className="text-slate-500 text-sm font-mono">{String(val ?? '')}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Situs Terkait</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola link situs terkait</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['nama', 'deskripsi', 'kategori']}
          onCreate={hasPermission('spme.create') ? () => navigate('/admin/spme/situs/create') : undefined}
          onEdit={(item) => navigate(`/admin/spme/situs/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Situs"
          emptyMessage="Belum ada situs terkait."
        />
      </div>
    </div>
  );
}