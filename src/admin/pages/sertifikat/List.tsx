import { useState, useEffect, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, FileDown, X, Eye } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSertifikats, deleteSertifikat, type SertifikatResponse } from '../../../lib/api';

const JENJANG_STYLES: Record<string, string> = {
  S1: 'bg-blue-100 text-blue-700',
  S2: 'bg-green-100 text-green-700',
  S3: 'bg-purple-100 text-purple-700',
};

const SKOR_STYLES: Record<string, string> = {
  Unggul: 'bg-green-100 text-green-700',
  A: 'bg-blue-100 text-blue-700',
  B: 'bg-yellow-100 text-yellow-700',
  'Baik Sekali': 'bg-purple-100 text-purple-700',
};

interface SertifikatWithProdi extends SertifikatResponse {
  prodi: {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
    fakultases_id: number;
    fakulta?: {
      id: number;
      kode_fakulta: string;
      nama_fakulta: string;
    };
  };
}

interface GroupedProdi {
  prodiId: number;
  prodiNama: string;
  prodiKode: string;
  fakultaNama: string;
  sertifikats: SertifikatWithProdi[];
}

interface GroupedByFakulta {
  fakultaNama: string;
  prodis: GroupedProdi[];
}

export default function SertifikatList() {
  useEffect(() => { document.title = 'Manajemen Sertifikat :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const [sertifikats, setSertifikats] = useState<SertifikatWithProdi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProdiSertifikats, setSelectedProdiSertifikats] = useState<SertifikatWithProdi[]>([]);
  const [modalProdiNama, setModalProdiNama] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSertifikats({ per_page: 500 });
      setSertifikats(data.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }

  // Group by prodi and fakulta using useMemo
  const groupedByFakulta = useMemo((): GroupedByFakulta[] => {
    const prodiMap: Record<number, GroupedProdi> = {};

    sertifikats.forEach((sertifikat) => {
      const prodi = sertifikat.prodi;
      if (!prodi) return;

      if (!prodiMap[prodi.id]) {
        prodiMap[prodi.id] = {
          prodiId: prodi.id,
          prodiNama: prodi.nama_prodi,
          prodiKode: prodi.kode_prodi,
          fakultaNama: prodi.fakulta?.nama_fakulta || 'Lainnya',
          sertifikats: [],
        };
      }

      prodiMap[prodi.id].sertifikats.push(sertifikat);
    });

    const fakultaMap: Record<string, GroupedByFakulta> = {};

    Object.values(prodiMap).forEach((prodi) => {
      const key = prodi.fakultaNama;
      if (!fakultaMap[key]) {
        fakultaMap[key] = { fakultaNama: key, prodis: [] };
      }
      fakultaMap[key].prodis.push(prodi);
    });

    return Object.values(fakultaMap).sort((a, b) =>
      a.fakultaNama.localeCompare(b.fakultaNama)
    );
  }, [sertifikats]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleDelete = async (item: SertifikatWithProdi) => {
    if (!confirm('Yakin ingin menghapus sertifikat ini?')) return;
    try {
      await deleteSertifikat(item.id);
      setSertifikats(prev => prev.filter(x => x.id !== item.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus');
    }
  };

  const handleCreate = () => navigate('/admin/sertifikat/create');
  const handleEdit = (item: SertifikatWithProdi) => navigate(`/admin/sertifikat/${item.id}/edit`);

  const openHistoryModal = (groupProdi: GroupedProdi) => {
    setSelectedProdiSertifikats(groupProdi.sertifikats);
    setModalProdiNama(`${groupProdi.prodiNama} (${groupProdi.prodiKode})`);
    setShowModal(true);
  };

  const totalCount = sertifikats.length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Manajemen Sertifikat Akreditasi</h1>
              <p className="text-sky-100 text-sm mt-0.5">Kelola data sertifikat akreditasi program studi</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Sertifikat Akreditasi</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola data sertifikat akreditasi program studi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-2xl font-black text-white">{totalCount}</div>
            <p className="text-sky-200 text-xs font-medium">Total</p>
          </div>
          {hasPermission('sertifikat.create') && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow"
            >
              <Plus size={16} /> Tambah Sertifikat
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-semibold">Error: {error}</p>
          <button onClick={loadData} className="mt-2 text-sm underline">Coba lagi</button>
        </div>
      )}

      {/* Grouped Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama Program Studi</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-16">Jenjang</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Masa Aktif</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">Nilai</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-28">Hasil</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">Unduh</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {groupedByFakulta.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-slate-400">
                    Belum ada data sertifikat.
                  </td>
                </tr>
              ) : (
                groupedByFakulta.map(group => (
                  <Fragment key={group.fakultaNama}>
                    {/* Group Header */}
                    <tr className="bg-sky-50">
                      <td colSpan={8} className="px-4 py-2.5">
                        <span className="font-bold text-sky-800 text-sm">{group.fakultaNama}</span>
                      </td>
                    </tr>
                    {/* Group Rows */}
                    {group.prodis.map((prodi, idx) => {
                      const latestSertifikat = [...prodi.sertifikats].sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                      )[0];

                      return (
                        <tr key={prodi.prodiId} className="border-b border-slate-100 hover:bg-sky-50/30 transition-colors">
                          <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800">{prodi.prodiNama}</span>
                            <span className="text-slate-400 text-xs ml-1">({prodi.prodiKode})</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${JENJANG_STYLES[latestSertifikat.jenjang] ?? 'bg-slate-100 text-slate-600'}`}>
                              {latestSertifikat.jenjang}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatDate(latestSertifikat.mulai_aktif)} — {formatDate(latestSertifikat.akhir_aktif)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {latestSertifikat.nilai ? (
                              <span className="font-bold text-slate-800 text-sm">{latestSertifikat.nilai}</span>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${SKOR_STYLES[latestSertifikat.skor] ?? 'bg-slate-100 text-slate-600'}`}>
                              {latestSertifikat.skor}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {latestSertifikat.file_sk ? (
                              <a
                                href={latestSertifikat.file_sk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 text-sky-600 hover:bg-sky-50 rounded-lg text-xs font-medium transition-colors"
                              >
                                <FileDown size={14} /> Unduh
                              </a>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {prodi.sertifikats.length > 1 && (
                                <button
                                  onClick={() => openHistoryModal(prodi)}
                                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title={`Lihat ${prodi.sertifikats.length} Riwayat`}
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEdit(latestSertifikat)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(latestSertifikat)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Riwayat Sertifikat</h2>
                <p className="text-sm text-slate-500 mt-0.5">{modalProdiNama}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Jenjang</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Mulai</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Akhir</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Nilai</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Hasil</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Unduh</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProdiSertifikats.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-400">
                        Tidak ada riwayat sertifikat.
                      </td>
                    </tr>
                  ) : (
                    selectedProdiSertifikats
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((sertifikat, index) => (
                        <tr key={sertifikat.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${JENJANG_STYLES[sertifikat.jenjang] ?? 'bg-slate-100 text-slate-600'}`}>
                              {sertifikat.jenjang}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(sertifikat.mulai_aktif)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(sertifikat.akhir_aktif)}</td>
                          <td className="px-4 py-3 text-center">
                            {sertifikat.nilai ? (
                              <span className="font-bold text-slate-800 text-sm">{sertifikat.nilai}</span>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${SKOR_STYLES[sertifikat.skor] ?? 'bg-slate-100 text-slate-600'}`}>
                              {sertifikat.skor}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {sertifikat.file_sk ? (
                              <a
                                href={sertifikat.file_sk}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 text-sky-600 hover:bg-sky-50 rounded-lg text-xs font-medium transition-colors"
                              >
                                <FileDown size={14} /> Unduh
                              </a>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  handleEdit(sertifikat);
                                  setShowModal(false);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(sertifikat);
                                  setSelectedProdiSertifikats(prev => prev.filter(s => s.id !== sertifikat.id));
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
