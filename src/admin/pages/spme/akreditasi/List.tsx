import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, Download, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import type { Akreditasi } from '../../../../lib/types';
import { getAkreditasi, deleteAkreditasi } from '../../../../lib/mockData';
import { useAuth } from '../../../../context/AuthContext';

const TIPE_OPTIONS = ['AMI Auditee', 'AMI Auditor', 'Evaluasi Diri', 'Program Studi'];

export default function SpmeAkreditasiList() {
  useEffect(() => { document.title = 'Instrumen Akreditasi :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<Akreditasi[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAkreditasi();
      setData(list.sort((a, b) => a.urutan - b.urutan));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: Akreditasi) => {
    await deleteAkreditasi(item.id);
    await load();
  };

  const tipeStyles: Record<string, string> = {
    'AMI Auditee': 'bg-blue-100 text-blue-700',
    'AMI Auditor': 'bg-green-100 text-green-700',
    'Evaluasi Diri': 'bg-yellow-100 text-yellow-700',
    'Program Studi': 'bg-purple-100 text-purple-700',
  };

  const columns = [
    {
      key: 'urutan',
      label: 'Judul',
      render: (_: unknown, item: Akreditasi) => (
        <div>
          <p className="font-semibold text-slate-800">{item.judul}</p>
          <p className="text-slate-500 text-xs mt-0.5 max-w-xs truncate">{item.deskripsi}</p>
        </div>
      ),
    },
    {
      key: 'tipe',
      label: 'Tipe',
      render: (val: unknown) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${tipeStyles[String(val ?? '')] ?? 'bg-slate-100 text-slate-600'}`}>
          {String(val ?? '')}
        </span>
      ),
    },
    {
      key: 'file',
      label: 'File',
      render: (_: unknown, item: Akreditasi) => (
        item.file ? (
          <a href={item.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs font-medium">
            <Download size={14} /> Unduh
          </a>
        ) : <span className="text-slate-400 text-xs">-</span>
      ),
    },
    {
      key: 'linkEksternal',
      label: 'Link',
      render: (_: unknown, item: Akreditasi) => (
        item.linkEksternal ? (
          <a href={item.linkEksternal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs">
            <ExternalLink size={14} />
          </a>
        ) : <span className="text-slate-400">-</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (val: unknown) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {val ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Instrumen Akreditasi</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola instrumen akreditasi BAN-PT</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['judul', 'deskripsi', 'tipe']}
          onCreate={hasPermission('spme.create') ? () => navigate('/admin/spme/akreditasi/create') : undefined}
          onEdit={(item) => navigate(`/admin/spme/akreditasi/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Instrumen"
          emptyMessage="Belum ada instrumen akreditasi."
        />
      </div>
    </div>
  );
}