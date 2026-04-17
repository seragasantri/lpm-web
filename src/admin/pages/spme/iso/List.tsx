import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Plus, Download, ExternalLink } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import type { IsoMilestone } from '../../../../lib/types';
import { getIso, deleteIso } from '../../../../lib/mockData';
import { useAuth } from '../../../../context/AuthContext';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  current: 'bg-blue-100 text-blue-700',
  upcoming: 'bg-yellow-100 text-yellow-700',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Tuntas',
  current: 'Berjalan',
  upcoming: 'Mendatang',
};

export default function SpmeIsoList() {
  useEffect(() => { document.title = 'ISO Milestone :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<IsoMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getIso();
      setData(list.sort((a, b) => a.urutan - b.urutan));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: IsoMilestone) => {
    await deleteIso(item.id);
    await load();
  };

  const columns = [
    {
      key: 'tahun',
      label: 'Tahun',
      render: (val: unknown) => (
        <span className="font-bold text-lg text-sky-700">{String(val ?? '')}</span>
      ),
    },
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: IsoMilestone) => (
        <div>
          <p className="font-semibold text-slate-800">{item.judul}</p>
          <p className="text-slate-500 text-xs mt-0.5 max-w-xs truncate">{item.deskripsi}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: unknown) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[String(val ?? '')] ?? 'bg-slate-100 text-slate-600'}`}>
          {STATUS_LABELS[String(val ?? '')] ?? String(val ?? '')}
        </span>
      ),
    },
    {
      key: 'dokumen',
      label: 'Dokumen',
      render: (_: unknown, item: IsoMilestone) => (
        item.dokumen && item.dokumen.length > 0 ? (
          <a href={item.dokumen[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs font-medium">
            <Download size={14} /> Unduh
          </a>
        ) : <span className="text-slate-400 text-xs">-</span>
      ),
    },
    {
      key: 'linkEksternal',
      label: 'Link',
      render: (_: unknown, item: IsoMilestone) => (
        item.linkEksternal ? (
          <a href={item.linkEksternal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs">
            <ExternalLink size={14} />
          </a>
        ) : <span className="text-slate-400">-</span>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <FileCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">ISO Milestone</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola milestone sertifikasi ISO</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['tahun', 'judul', 'deskripsi']}
          onCreate={hasPermission('spme.create') ? () => navigate('/admin/spme/iso/create') : undefined}
          onEdit={(item) => navigate(`/admin/spme/iso/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah Milestone"
          emptyMessage="Belum ada milestone ISO."
        />
      </div>
    </div>
  );
}