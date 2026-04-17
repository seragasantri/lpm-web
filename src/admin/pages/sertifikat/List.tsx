import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, FileDown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSertifikat, deleteSertifikat, getProdi, getFaker } from '../../../lib/mockData';
import type { Sertifikat, Prodi, Faker } from '../../../lib/types';

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

interface GroupedData {
  faker: Faker;
  prodis: (Prodi & { sertifikats: Sertifikat[] })[];
}

export default function SertifikatList() {
  useEffect(() => { document.title = 'Manajemen Sertifikat :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();
  const [sertifikats, setSertifikats] = useState<Sertifikat[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [fakers, setFakers] = useState<Faker[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getSertifikat(), getProdi(), getFaker()]).then(([s, p, f]) => {
      setSertifikats(s);
      setProdis(p);
      setFakers(f);
      setLoading(false);
    });
  }, []);

  // Build grouped data
  const groupedData: GroupedData[] = fakers
    .map(faker => ({
      faker,
      prodis: prodiData(faker.id),
    }))
    .filter(g => g.prodis.length > 0);

  function prodiData(fakerId: string): (Prodi & { sertifikats: Sertifikat[] })[] {
    return prodis
      .filter(p => p.faker_id === fakerId)
      .map(p => ({
        ...p,
        sertifikats: sertifikats.filter(s => s.prodiId === p.id),
      }));
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleDelete = async (item: Sertifikat) => {
    if (!confirm('Yakin ingin menghapus sertifikat ini?')) return;
    await deleteSertifikat(item.id);
    setSertifikats(prev => prev.filter(x => x.id !== item.id));
  };

  const handleCreate = () => navigate('/admin/sertifikat/create');
  const handleEdit = (item: Sertifikat) => navigate(`/admin/sertifikat/${item.id}/edit`);

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
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-slate-400">
                    Belum ada data sertifikat.
                  </td>
                </tr>
              ) : (
                groupedData.map(group => (
                  <Fragment key={group.faker.id}>
                    {/* Group Header */}
                    <tr className="bg-sky-50">
                      <td colSpan={8} className="px-4 py-2.5">
                        <span className="font-bold text-sky-800 text-sm">{group.faker.nama_faker}</span>
                      </td>
                    </tr>
                    {/* Group Rows */}
                    {group.prodis.map((prodi) => {
                      if (prodi.sertifikats.length === 0) {
                        return (
                          <tr key={prodi.id} className="border-b border-slate-100">
                            <td className="px-4 py-3 text-slate-400">-</td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-slate-800">{prodi.nama_prodi}</span>
                              <span className="text-slate-400 text-xs ml-1">({prodi.kode_prodi})</span>
                            </td>
                            <td colSpan={5} className="px-4 py-3">
                              <button
                                onClick={handleCreate}
                                className="px-2 py-1 text-xs text-sky-600 hover:bg-sky-50 rounded-lg font-medium transition-colors"
                              >
                                + Tambah Sertifikat
                              </button>
                            </td>
                          </tr>
                        );
                      }
                      return prodi.sertifikats.map((sertifikat, sIdx) => (
                        <tr key={`${prodi.id}-${sertifikat.id}`} className="border-b border-slate-100 hover:bg-sky-50/30 transition-colors">
                          <td className="px-4 py-3 text-slate-400">{sIdx === 0 ? '-' : ''}</td>
                          <td className="px-4 py-3">
                            {sIdx === 0 && (
                              <>
                                <span className="font-semibold text-slate-800">{prodi.nama_prodi}</span>
                                <span className="text-slate-400 text-xs ml-1">({prodi.kode_prodi})</span>
                              </>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${JENJANG_STYLES[sertifikat.jenjang] ?? 'bg-slate-100 text-slate-600'}`}>
                              {sertifikat.jenjang}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatDate(sertifikat.mulaiAktif)} — {formatDate(sertifikat.akhirAktif)}
                          </td>
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
                            {sertifikat.fileSk ? (
                              <a
                                href={sertifikat.fileSk}
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
                                onClick={() => handleEdit(sertifikat)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(sertifikat)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

