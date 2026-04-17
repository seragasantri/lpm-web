import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Award, Download, QrCode, CheckCircle } from 'lucide-react';
import { getSertifikat, getProdi, getFaker } from '../lib/mockData';
import type { Sertifikat, Prodi, Faker } from '../lib/types';

interface GroupedData {
  faker: Faker;
  rows: { prodi: Prodi; sertifikat: Sertifikat }[];
}

const STAT_CONFIGS = [
  { label: 'Akreditasi Unggul', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { label: 'Akreditasi A', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { label: 'Akreditasi B', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { label: 'Baik Sekali', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
];

const HASIL_STYLES: Record<string, string> = {
  Unggul: 'bg-emerald-100 text-emerald-700',
  A: 'bg-blue-100 text-blue-700',
  B: 'bg-yellow-100 text-yellow-700',
  'Baik Sekali': 'bg-purple-100 text-purple-700',
};

export default function SertifikatPage() {
  useEffect(() => { document.title = 'Sertifikat Akreditasi :: LPM UIN Raden Fatah Palembang'; }, []);

  const [sertifikats, setSertifikats] = useState<Sertifikat[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [fakers, setFakers] = useState<Faker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSertifikat(), getProdi(), getFaker()]).then(([s, p, f]) => {
      setSertifikats(s);
      setProdis(p);
      setFakers(f);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const groupedData: GroupedData[] = fakers
    .map(faker => ({
      faker,
      rows: prodis
        .filter(p => p.faker_id === faker.id)
        .flatMap(p =>
          sertifikats
            .filter(s => s.prodiId === p.id)
            .map(sertifikat => ({ prodi: p, sertifikat }))
        ),
    }))
    .filter(g => g.rows.length > 0);

  const stats = STAT_CONFIGS.map(cfg => ({
    ...cfg,
    count: sertifikats.filter(s => s.skor === cfg.label).length,
  }));

  const totalProdi = sertifikats.length;

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Beranda
            </Link>
            <span>/</span>
            <span>Akreditasi</span>
            <span>/</span>
            <span className="text-white font-medium">Sertifikat</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sertifikat Akreditasi</h1>
          <p className="text-sky-100">Daftar akreditasi program studi UIN Raden Fatah Palembang</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Statistik Akreditasi</h2>
              <p className="text-slate-500 text-sm mt-1">Total {totalProdi} sertifikat</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={20} />
              <span className="font-semibold text-sm">Terverifikasi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 text-center`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.color} rounded-full mb-2`}>
                  <Award size={18} className="text-white" />
                </div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.count}</p>
                <p className={`text-xs font-medium ${stat.textColor} mt-0.5`}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div>
            <div className="flex items-end gap-2 h-24">
              {stats.map((stat, index) => {
                const width = totalProdi > 0 ? (stat.count / totalProdi) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full ${stat.color} rounded-t-md transition-all duration-300`}
                      style={{ height: `${Math.max((width / 100) * 96, 4)}px` }}
                      title={`${stat.label}: ${stat.count}`}
                    />
                    <span className="text-xs text-slate-500 font-medium">{stat.count}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex-1 flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${stat.color} flex-shrink-0`} />
                  <span className="text-xs text-slate-500 truncate">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Verification Note */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-6 flex gap-4 items-start">
          <QrCode size={22} className="text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 mb-1">Verifikasi dengan QR Code</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Setiap sertifikat akreditasi dapat diverifikasi melalui QR code yang tertera pada dokumen asli.
              Scan QR code pada sertifikat atau kunjungi portal verikasi BAN-PT untuk memastikan keaslian dokumen.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : groupedData.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                Belum ada data sertifikat.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-12">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Program Studi</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">Jenjang</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Masa Berlaku</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">Nilai</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-24">Hasil</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-20">Unduh</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData.map(group => (
                    <React.Fragment key={group.faker.id}>
                      {/* Group Header */}
                      <tr className="bg-sky-50 border-b border-sky-200">
                        <td colSpan={7} className="px-4 py-2.5">
                          <span className="font-bold text-sky-800 text-sm">{group.faker.nama_faker}</span>
                        </td>
                      </tr>
                      {/* Rows */}
                      {group.rows.map((row, sIdx) => (
                        <tr
                          key={`${row.prodi.id}-${row.sertifikat.id}`}
                          className={`border-b border-slate-100 ${sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-sky-50 transition-colors`}
                        >
                          <td className="px-4 py-3 text-slate-600">{sIdx + 1}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{row.prodi.nama_prodi}</td>
                          <td className="px-4 py-3">
                            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
                              {row.sertifikat.jenjang}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {formatDate(row.sertifikat.mulaiAktif)} — {formatDate(row.sertifikat.akhirAktif)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-slate-800 text-sm">{row.sertifikat.nilai || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${HASIL_STYLES[row.sertifikat.skor] ?? 'bg-slate-100 text-slate-600'}`}>
                              {row.sertifikat.skor}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {row.sertifikat.fileSk ? (
                              <a
                                href={row.sertifikat.fileSk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs font-medium transition-colors"
                              >
                                <Download size={13} /> Unduh
                              </a>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Download All */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <QrCode size={16} />
            Verifikasi Online
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Download size={16} />
            Unduh Daftar Lengkap
          </a>
        </div>
      </div>
    </div>
  );
}
