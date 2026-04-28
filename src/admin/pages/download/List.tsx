import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, FileSpreadsheet, Archive, Link2, File } from 'lucide-react';
import DataTable from '../../components/DataTable';
import type { DownloadResponse } from '../../../lib/api';
import { getDownloads, deleteDownload } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

const TIPE_CONFIG: Record<string, { label: string; badge: string; Icon: React.ElementType }> = {
  pdf:  { label: 'PDF',  badge: 'bg-red-100 text-red-700',    Icon: FileText },
  doc:  { label: 'DOC',  badge: 'bg-blue-100 text-blue-700',  Icon: File },
  xls:  { label: 'XLS',  badge: 'bg-green-100 text-green-700', Icon: FileSpreadsheet },
  zip:  { label: 'ZIP',  badge: 'bg-amber-100 text-amber-700', Icon: Archive },
  link: { label: 'Link', badge: 'bg-purple-100 text-purple-700', Icon: Link2 },
};

function getTipeConfig(tipe: string) {
  return TIPE_CONFIG[tipe.toLowerCase()] ?? { label: tipe.toUpperCase(), badge: 'bg-slate-100 text-slate-600', Icon: File };
}

export default function DownloadList() {
  useEffect(() => { document.title = 'Manajemen download :: LPM Admin'; }, []);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [data, setData] = useState<DownloadResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getDownloads();
      setData(list);
    } catch (err) {
      console.error('Gagal memuat data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: DownloadResponse) => {
    if (!confirm(`Hapus "${item.judul}"?`)) return;
    try {
      await deleteDownload(item.id);
      await load();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const columns = [
    {
      key: 'judul',
      label: 'Judul',
      render: (_: unknown, item: DownloadResponse) => {
        const cfg = getTipeConfig(item.tipe);
        const Icon = cfg.Icon;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-slate-500" />
            </div>
            <span className="font-semibold text-slate-800">{item.judul}</span>
          </div>
        );
      },
    },
    {
      key: 'tipe',
      label: 'Tipe',
      render: (_: unknown, item: DownloadResponse) => {
        const cfg = getTipeConfig(item.tipe);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'ukuran',
      label: 'Ukuran',
      render: (_: unknown, item: DownloadResponse) => (
        <span className="text-slate-500 text-sm">{item.ukuran ?? '-'}</span>
      ),
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (_: unknown, item: DownloadResponse) => (
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
            <Download size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Manajemen Download</h1>
            <p className="text-sky-200 text-sm mt-0.5">Kelola file dan tautan unduhan LPM</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={['judul']}
          onCreate={hasPermission('download.create') ? () => navigate('/admin/download/create') : undefined}
          onEdit={(item) => navigate(`/admin/download/edit/${item.id}`)}
          onDelete={handleDelete}
          createLabel="Tambah File"
          emptyMessage="Belum ada file unduhan."
        />
      </div>
    </div>
  );
}
