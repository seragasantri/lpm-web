import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, Award, Download, QrCode, CheckCircle, AlertTriangle, X, History, FileText } from 'lucide-react';
import { getPublicSertifikats } from '../lib/api';

/**
 * INTERFACES & API FETCHING
 */
export interface SertifikatResponse {
  id: number;
  prodis_id: number;
  jenjang: string;
  mulai_aktif: string;
  akhir_aktif: string;
  nilai: string | null;
  skor: string;
  file_sk: string | null;
  created_at: string | null;
  updated_at: string | null;
  prodi: {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    fakultas_id: number;
    fakultas: {
      id: number;
      kode_fakultas: string;
      nama_fakultas: string;
    };
  };
}

// Fungsi untuk mengambil data dari API publik LPM
const getSertifikats = async (): Promise<{ success: boolean; data: SertifikatResponse[] }> => {
  try {
    const data = await getPublicSertifikats();
    return { success: true, data };
  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
    return { success: false, data: [] };
  }
};

const STAT_CONFIGS = [
  { label: 'Unggul', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { label: 'A', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { label: 'B', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { label: 'Baik Sekali', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
];

const HASIL_STYLES: Record<string, string> = {
  Unggul: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  A: 'bg-blue-100 text-blue-700 border-blue-200',
  B: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Baik Sekali': 'bg-purple-100 text-purple-700 border-purple-200',
};

interface ProdiRow {
  prodiNama: string;
  prodiKode: string;
  jenjang: string;
  latestSertifikat: SertifikatResponse;
  history: SertifikatResponse[];
}

interface GroupedData {
  fakultaNama: string;
  rows: ProdiRow[];
}

export default function App() {
  useEffect(() => { document.title = 'Sertifikat Akreditasi :: LPM UIN Raden Fatah Palembang'; }, []);

  const [sertifikats, setSertifikats] = useState<SertifikatResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProdi, setSelectedProdi] = useState<ProdiRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getSertifikats();
        // Sesuai respons JSON: data berada di property 'data'
        const rawData = response?.data || [];
        setSertifikats(rawData);
      } catch (err) {
        console.error('Error loading sertifikat:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const checkIsExpiringSoon = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    return expiryDate < oneYearFromNow && expiryDate > today;
  };

  const groupedData = useMemo((): GroupedData[] => {
    const map = sertifikats.reduce<Record<string, GroupedData>>((acc, sertifikat) => {
      const prodi = sertifikat.prodi;
      if (!prodi) return acc;

      const fakultaNama = prodi.fakultas?.nama_fakultas || prodi.fakultas?.nama_fakultas || 'Lainnya';

      if (!acc[fakultaNama]) {
        acc[fakultaNama] = { fakultaNama, rows: [] };
      }

      const existingIndex = acc[fakultaNama].rows.findIndex(r => r.prodiKode === prodi.kode_prodi);

      if (existingIndex === -1) {
        acc[fakultaNama].rows.push({
          prodiNama: prodi.nama_prodi,
          prodiKode: prodi.kode_prodi,
          jenjang: sertifikat.jenjang,
          latestSertifikat: sertifikat,
          history: [sertifikat],
        });
      } else {
        const row = acc[fakultaNama].rows[existingIndex];
        row.history.push(sertifikat);

        // Menentukan yang terbaru berdasarkan mulai_aktif (lebih akurat jika created_at null)
        const existingDate = new Date(row.latestSertifikat.mulai_aktif || 0).getTime();
        const newDate = new Date(sertifikat.mulai_aktif || 0).getTime();

        if (newDate > existingDate) {
          row.latestSertifikat = sertifikat;
        }

        // Sort history: yang terbaru di atas
        row.history.sort((a, b) => new Date(b.mulai_aktif || 0).getTime() - new Date(a.mulai_aktif || 0).getTime());
      }
      return acc;
    }, {});

    return Object.values(map)
      .filter(g => g.rows.length > 0)
      .sort((a, b) => a.fakultaNama.localeCompare(b.fakultaNama));
  }, [sertifikats]);

  const stats = useMemo(() => {
    return STAT_CONFIGS.map(cfg => {
      const count = groupedData.reduce((total, group) =>
        total + group.rows.filter(r => r.latestSertifikat.skor === cfg.label).length, 0
      );
      return { ...cfg, count };
    });
  }, [groupedData]);

  const totalProdi = useMemo(() =>
    groupedData.reduce((sum, g) => sum + g.rows.length, 0),
    [groupedData]);

  const openHistory = (prodi: ProdiRow) => {
    setSelectedProdi(prodi);
    setIsModalOpen(true);
  };

  const closeHistory = () => {
    setIsModalOpen(false);
    setSelectedProdi(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-12 text-slate-900">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Beranda
            </a>
            <span>/</span>
            <span>Akreditasi</span>
            <span>/</span>
            <span className="text-white font-medium">Sertifikat</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Sertifikat Akreditasi</h1>
          <p className="text-sky-100 opacity-90 italic">Portal Resmi Sistem Informasi Akreditasi LPM UIN Raden Fatah</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Ringkasan Statistik */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Statistik Akreditasi</h2>
              <p className="text-slate-500 text-sm mt-1">Total {totalProdi} Program Studi Terdata</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <CheckCircle size={16} />
              <span className="font-semibold text-[10px] uppercase tracking-wider text-emerald-700">Data Sinkron</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 text-center transition-all hover:shadow-md hover:scale-[1.02] shadow-sm`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.color} rounded-full mb-2 shadow-sm`}>
                  <Award size={18} className="text-white" />
                </div>
                <p className={`text-2xl font-black ${stat.textColor}`}>{stat.count}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${stat.textColor} mt-0.5`}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} transition-all duration-1000`}
                  style={{ width: `${totalProdi > 0 ? (stat.count / totalProdi) * 100 : 0}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}: {Math.round((stat.count / totalProdi) * 100) || 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verifikasi QR Note */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-8 flex gap-4 items-center">
          <div className="bg-white p-3 rounded-xl shadow-sm text-sky-600 border border-sky-100">
            <QrCode size={24} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">Verifikasi Dokumen Elektronik</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Dokumen dapat diverifikasi langsung melalui portal BAN-PT atau LAM dengan memindai kode QR yang tersemat pada file PDF asli.
            </p>
          </div>
        </div>

        {/* Tabel Data Utama */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-sky-600" size={20} />
              Daftar Sertifikat Aktif
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-400 text-sm font-medium animate-pulse tracking-widest uppercase">Menghubungkan ke server...</span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 font-bold text-slate-500 w-12 uppercase tracking-wider text-[10px]">No</th>
                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Program Studi</th>
                    <th className="text-center px-5 py-4 font-bold text-slate-500 w-24 uppercase tracking-wider text-[10px]">Jenjang</th>
                    <th className="text-left px-5 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Masa Berlaku</th>
                    <th className="text-center px-5 py-4 font-bold text-slate-500 w-24 uppercase tracking-wider text-[10px]">Predikat</th>
                    <th className="text-center px-5 py-4 font-bold text-slate-500 w-32 uppercase tracking-wider text-[10px]">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groupedData.map(group => (
                    <React.Fragment key={group.fakultaNama}>
                      <tr className="bg-slate-100/60">
                        <td colSpan={6} className="px-5 py-3 border-y border-slate-200/50">
                          <span className="font-black text-sky-800 text-[11px] uppercase tracking-[0.2em]">FAKULTAS {group.fakultaNama}</span>
                        </td>
                      </tr>
                      {group.rows.map((row, sIdx) => {
                        const isExpiring = checkIsExpiringSoon(row.latestSertifikat.akhir_aktif);

                        return (
                          <tr key={row.prodiKode} className="group transition-colors hover:bg-sky-50/40">
                            <td className="px-5 py-5 text-slate-400 font-medium">{sIdx + 1}</td>
                            <td className="px-5 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                                  {row.prodiNama}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wider uppercase">
                                  KODE: {row.prodiKode}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-5 text-center">
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded shadow-sm border border-slate-200 italic">
                                {row.jenjang}
                              </span>
                            </td>
                            <td className="px-5 py-5">
                              <div className={`flex flex-col text-[11px] ${isExpiring ? 'text-orange-600' : 'text-slate-500'}`}>
                                <span className="font-medium">{formatDate(row.latestSertifikat.mulai_aktif)} —</span>
                                <span className="font-bold">{formatDate(row.latestSertifikat.akhir_aktif)}</span>
                                {isExpiring && (
                                  <div className="flex items-center gap-1 mt-1 text-[9px] font-black uppercase bg-orange-50 w-fit px-1.5 py-0.5 rounded border border-orange-100 animate-pulse">
                                    <AlertTriangle size={10} /> Re-Akreditasi
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-5 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border shadow-sm ${HASIL_STYLES[row.latestSertifikat.skor] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {row.latestSertifikat.skor}
                              </span>
                            </td>
                            <td className="px-5 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {row.latestSertifikat.file_sk ? (
                                  <a
                                    href={row.latestSertifikat.file_sk.startsWith('http') ? row.latestSertifikat.file_sk : `${row.latestSertifikat.file_sk}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition-all shadow-sm border border-sky-100"
                                    title="Unduh Sertifikat Terbaru"
                                  >
                                    <Download size={16} />
                                  </a>
                                ) : (
                                  <div className="p-2 bg-slate-50 text-slate-300 rounded-lg border border-slate-100 cursor-not-allowed">
                                    <Download size={16} />
                                  </div>
                                )}
                                <button
                                  onClick={() => openHistory(row)}
                                  className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all shadow-sm border border-purple-100"
                                  title="Lihat Riwayat Sertifikat"
                                >
                                  <History size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
          <p className="text-[10px] text-slate-400 italic mr-2">* Data bersumber dari database LPM UIN Raden Fatah Palembang</p>
          <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95">
            <QrCode size={14} />
            Portal BAN-PT
          </button>
          <button className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
            <Download size={14} />
            Unduh Rekapitulasi
          </button>
        </div>
      </div>

      {/* Modal Riwayat Sertifikat */}
      {isModalOpen && selectedProdi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300" onClick={closeHistory} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <History size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight">Riwayat Sertifikat</h3>
                  <p className="text-sm text-slate-500 font-medium tracking-tight uppercase">{selectedProdi.prodiNama}</p>
                </div>
              </div>
              <button onClick={closeHistory} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
              <div className="grid gap-4">
                {selectedProdi.history.map((cert, index) => (
                  <div key={cert.id} className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-sky-300 ${index === 0 ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${index === 0 ? 'bg-sky-100 text-sky-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm border italic ${index === 0 ? 'bg-sky-600 text-white border-sky-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{cert.jenjang}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${HASIL_STYLES[cert.skor] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>{cert.skor}</span>
                          {index === 0 && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-tighter">Status Aktif</span>}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Rentang Masa Berlaku:</p>
                        <p className="text-sm text-slate-800 font-bold tracking-tight">{formatDate(cert.mulai_aktif)} — {formatDate(cert.akhir_aktif)}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      {cert.file_sk ? (
                        <a
                          href={cert.file_sk.startsWith('http') ? cert.file_sk : `${cert.file_sk}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 group"
                        >
                          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Unduh File SK
                        </a>
                      ) : (
                        <button disabled className="w-full sm:w-auto px-5 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold border border-slate-200 cursor-not-allowed">Berkas Tidak Tersedia</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
              <button onClick={closeHistory} className="px-8 py-2.5 bg-slate-900 hover:bg-slate-950 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 tracking-wide">TUTUP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}