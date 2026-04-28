import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getLogs, clearLogs, type ActivityLog } from '../../../lib/api';
import DataTable from '../../components/DataTable';
import { Activity, Trash2 } from 'lucide-react';

const ACTION_STYLES: Record<string, string> = {
  LOGIN: 'bg-green-100 text-green-700',
  LOGOUT: 'bg-slate-100 text-slate-600',
  CREATE: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
  PUBLISH: 'bg-green-100 text-green-700',
  DRAFT: 'bg-orange-100 text-orange-700',
  ARCHIVED: 'bg-slate-100 text-slate-500',
};

export default function LogIndex() {
  useEffect(() => { document.title = 'Log Aktivitas :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  const fetchLogs = () => {
    if (!hasPermission('log.read')) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    getLogs()
      .then(data => { setLogs(data); setLoading(false); })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Gagal memuat log aktivitas');
        setLoading(false);
      });
  };

  useEffect(() => { fetchLogs(); }, [hasPermission]);

  const handleClear = async () => {
    if (!confirm('Yakin ingin menghapus semua log aktivitas?')) return;
    await clearLogs();
    setLogs([]);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    getLogs()
      .then(data => { setLogs(data); setLoading(false); setIsMockData(false); })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Gagal memuat log aktivitas');
        setLoading(false);
      });
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!hasPermission('log.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses ke log aktivitas.
      </div>
    </div>
  );

  const columns = [
    {
      key: 'timestamp',
      label: 'Waktu',
      sortable: true,
      render: (_: unknown, item: ActivityLog) => (
        <span className="text-slate-500 whitespace-nowrap">{formatTime(item.timestamp)}</span>
      ),
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
    },
    {
      key: 'module',
      label: 'Modul',
      sortable: true,
    },
    {
      key: 'detail',
      label: 'Detail',
      render: (_: unknown, item: ActivityLog) => (
        <span className="text-slate-500 text-xs max-w-xs truncate block">{item.detail ?? '-'}</span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Log Aktivitas</h1>
            <p className="text-sky-100 text-sm mt-0.5">Riwayat aktivitas pengguna di sistem</p>
          </div>
        </div>
        {logs.length > 0 && (
          <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-colors">
            <Trash2 size={16} /> Hapus Semua Log
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchable={['username', 'action', 'module', 'detail']}
        emptyMessage="Belum ada log aktivitas."
        loading={loading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-red-700 font-semibold">Gagal memuat log aktivitas</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-500 text-xs mt-2">Endpoint: GET /api/logs (500 Internal Server Error)</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!error && logs.length > 0 && isMockData && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-amber-700 font-semibold">Menampilkan data contoh</p>
            <p className="text-amber-600 text-sm mt-1">API backend belum tersedia. Data di bawah adalah contoh saja.</p>
          </div>
        </div>
      )}
    </div>
  );
}
