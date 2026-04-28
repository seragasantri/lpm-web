import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCircle2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import type { StafResponse } from '../../../lib/api';
import { getStafs, deleteStaf } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function StafList() {
  useEffect(() => { document.title = 'Manajemen staf :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<StafResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getStafs();
      setData(list.sort((a, b) => a.urutan - b.urutan));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: StafResponse) => {
    await deleteStaf(item.id);
    await load();
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama',
      render: (_: unknown, item: StafResponse) => (
        <div className="flex items-center gap-3">
          {item.foto ? (
            <img
              src={item.foto}
              alt={item.nama}
              className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100 border border-slate-200"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
              <UserCircle2 size={20} className="text-sky-400" />
            </div>
          )}
          <span className="font-semibold text-slate-800">{item.nama}</span>
        </div>
      ),
    },
    {
      key: 'jabatan',
      label: 'Jabatan',
      render: (_: unknown, item: StafResponse) => (
        <span className="text-slate-700 text-sm">{item.jabatan}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (_: unknown, item: StafResponse) => (
        item.email ? (
          <a
            href={`mailto:${item.email}`}
            className="text-sky-600 hover:text-sky-700 text-sm transition-colors"
          >
            {item.email}
          </a>
        ) : (
          <span className="text-slate-400 text-sm">-</span>
        )
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Manajemen Staf</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola data staf dan pegawai LPM</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['nama', 'jabatan']}
          onCreate={hasPermission('staf.create') ? () => navigate('/admin/staf/create') : undefined}
          onEdit={(item) => navigate(`/admin/staf/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Staf"
          emptyMessage="Belum ada data staf."
        />
      </div>
    </div>
  );
}