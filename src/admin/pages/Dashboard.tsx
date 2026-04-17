import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Image, Download, Users, Award,
  TrendingUp, Clock, AlertTriangle, Plus,
  ArrowRight, LogIn, LogOut, Pencil, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStats, getLogs, getSertifikat, getProdi } from '../../lib/mockData';
import type { ActivityLog, Sertifikat, Prodi } from '../../lib/types';

interface Stats {
  totalBerita: number;
  totalGaleri: number;
  totalDownload: number;
  totalStaf: number;
  publishedNews: number;
  draftNews: number;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  CREATE: <Plus size={14} className="text-green-600" />,
  UPDATE: <Pencil size={14} className="text-blue-600" />,
  DELETE: <Trash2 size={14} className="text-red-600" />,
  LOGIN: <LogIn size={14} className="text-sky-600" />,
  LOGOUT: <LogOut size={14} className="text-slate-600" />,
  READ: <Eye size={14} className="text-purple-600" />,
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'membuat',
  UPDATE: 'memperbarui',
  DELETE: 'menghapus',
  LOGIN: 'login',
  LOGOUT: 'logout',
  READ: 'membaca',
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return then.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpiringSoon(akhirAktif: string): boolean {
  if (!akhirAktif) return false;
  const endDate = new Date(akhirAktif);
  const now = new Date();
  const sixMonths = 180 * 24 * 60 * 60 * 1000;
  return endDate.getTime() - now.getTime() < sixMonths;
}

export default function Dashboard() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<{ cert: Sertifikat; prodi: Prodi | undefined }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, l, certs, prodis] = await Promise.all([
        getStats(),
        getLogs(),
        getSertifikat(),
        getProdi(),
      ]);
      setStats(s);
      setLogs(l.slice(0, 8));
      const prodiMap = new Map(prodis.map(p => [p.id, p]));
      setExpiringSoon(certs
        .filter((c: Sertifikat) => isExpiringSoon(c.akhirAktif))
        .map((c: Sertifikat) => ({ cert: c, prodi: prodiMap.get(c.prodiId) }))
      );
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Berita',
      value: stats?.totalBerita ?? 0,
      sub: `${stats?.publishedNews ?? 0} published, ${stats?.draftNews ?? 0} draft`,
      icon: <FileText size={24} />,
      color: 'from-sky-500 to-sky-600',
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-500',
      route: '/admin/berita',
      permission: 'berita.read',
    },
    {
      label: 'Galeri Foto',
      value: stats?.totalGaleri ?? 0,
      sub: 'Foto kegiatan',
      icon: <Image size={24} />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      route: '/admin/galeri',
      permission: 'galeri.read',
    },
    {
      label: 'File Download',
      value: stats?.totalDownload ?? 0,
      sub: 'Berkas tersedia',
      icon: <Download size={24} />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      route: '/admin/download',
      permission: 'download.read',
    },
    {
      label: 'Staf / Pejabat',
      value: stats?.totalStaf ?? 0,
      sub: 'Personel LPM',
      icon: <Users size={24} />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      route: '/admin/staf',
      permission: 'staf.read',
    },
  ];

  const quickActions = [
    { label: 'Tambah Berita', icon: <Plus size={16} />, route: '/admin/berita/create', permission: 'berita.create', color: 'bg-sky-600 hover:bg-sky-700' },
    { label: 'Tambah Galeri', icon: <Plus size={16} />, route: '/admin/galeri/create', permission: 'galeri.create', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Tambah Download', icon: <Plus size={16} />, route: '/admin/download/create', permission: 'download.create', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Tambah Staf', icon: <Plus size={16} />, route: '/admin/staf/create', permission: 'staf.create', color: 'bg-amber-600 hover:bg-amber-700' },
    { label: 'Tambah Sertifikat', icon: <Plus size={16} />, route: '/admin/sertifikat/create', permission: 'sertifikat.create', color: 'bg-teal-600 hover:bg-teal-700' },
    { label: 'Lihat Log', icon: <Clock size={16} />, route: '/admin/log', permission: 'log.read', color: 'bg-slate-600 hover:bg-slate-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Selamat Datang, {user?.username ?? 'Admin'}!</h1>
            <p className="text-sky-100 text-sm">Berikut ringkasan aktivitas panel administrasi LPM UIN Raden Fatah.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          if (!hasPermission(card.permission)) return null;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-sky-200 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${card.bgColor} flex items-center justify-center ${card.iconColor}`}>
                  {card.icon}
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all mt-1" />
              </div>
              <div className="text-3xl font-black text-slate-800 mb-0.5">{card.value}</div>
              <div className="text-sm font-semibold text-slate-600">{card.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{card.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              <h2 className="font-bold text-slate-700">Aktivitas Terbaru</h2>
            </div>
            {hasPermission('log.read') && (
              <button
                onClick={() => navigate('/admin/log')}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
              >
                Lihat semua <ArrowRight size={12} />
              </button>
            )}
          </div>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Clock size={36} className="mb-2" />
              <p className="text-sm">Belum ada aktivitas.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.map((log) => (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="mt-0.5">
                    {ACTION_ICONS[log.action] ?? <FileText size={14} className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{log.username}</span>{' '}
                      {ACTION_LABELS[log.action] ?? log.action}{' '}
                      <span className="font-medium text-slate-800">{log.module}</span>
                    </p>
                    {log.detail && <p className="text-xs text-slate-400 mt-0.5 truncate">{log.detail}</p>}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{formatTimeAgo(log.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {quickActions.some(a => hasPermission(a.permission)) && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" />
                <h2 className="font-bold text-slate-700">Aksi Cepat</h2>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  if (!hasPermission(action.permission)) return null;
                  return (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.route)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-white text-xs font-semibold transition-colors ${action.color}`}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expiring Certificates */}
          {hasPermission('sertifikat.read') && expiringSoon.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2 bg-amber-50">
                <AlertTriangle size={18} className="text-amber-500" />
                <h2 className="font-bold text-amber-700">Sertifikat Segera Habis</h2>
              </div>
              <div className="divide-y divide-amber-50">
                {expiringSoon.map(({ cert, prodi }) => (
                  <div key={cert.id} className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-800">{prodi?.nama_prodi ?? '-'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cert.jenjang}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${
                        cert.skor === 'Unggul' ? 'bg-green-100 text-green-700' :
                        cert.skor === 'A' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{cert.skor}</span>
                      <span className="text-xs text-amber-600 font-medium">Berakhir: {new Date(cert.akhirAktif).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
