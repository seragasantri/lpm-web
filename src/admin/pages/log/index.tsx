import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getLogs, clearLogs } from '../../../lib/mockData';
import type { ActivityLog } from '../../../lib/types';
import { Activity, Search, Trash2, Loader } from 'lucide-react';

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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!hasPermission('log.read')) { setLoading(false); return; }
    getLogs().then(data => { setLogs(data); setLoading(false); });
  }, [hasPermission]);

  const handleClear = async () => {
    if (!confirm('Yakin ingin menghapus semua log aktivitas?')) return;
    await clearLogs();
    setLogs([]);
  };

  const filtered = logs.filter(l =>
    l.username.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('log.read')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses ke log aktivitas.
      </div>
    </div>
  );

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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari username..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          <span className="text-sm text-slate-500">{filtered.length} entri</span>
        </div>
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Activity size={48} className="mb-3" />
              <p className="text-sm">Belum ada log aktivitas.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Waktu</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Username</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Aksi</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Modul</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => {
                  const actionUpper = log.action.toUpperCase();
                  const style = Object.keys(ACTION_STYLES).find(k => actionUpper.includes(k))
                    ? ACTION_STYLES[Object.keys(ACTION_STYLES).find(k => actionUpper.includes(k))!]
                    : 'bg-slate-100 text-slate-600';
                  return (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatTime(log.timestamp)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{log.username}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}>{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{log.module}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{log.detail ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
