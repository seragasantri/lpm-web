import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProdis, getSertifikats, createSertifikat, updateSertifikat, type ProdiResponse } from '../../../lib/api';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import SelectInput from '../../components/SelectInput';
import FileUpload from '../../components/FileUpload';

const SKOR_OPTS = ['Unggul', 'A', 'B', 'Baik Sekali'] as const;

interface FormState {
  prodiId: string;
  jenjang: string;
  mulaiAktif: string;
  akhirAktif: string;
  nilai: string;
  skor: string;
  fileSk: string;
}

export default function SertifikatForm({ editId }: { editId?: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const paramId = editId || id;

  const [prodiList, setProdiList] = useState<ProdiResponse[]>([]);
  const [form, setForm] = useState<FormState>({
    prodiId: '',
    jenjang: 'S1',
    mulaiAktif: '',
    akhirAktif: '',
    nilai: '',
    skor: 'A',
    fileSk: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodis = await getProdis();
        setProdiList(prodis);
        if (prodis.length > 0 && !form.prodiId) {
          setForm(prev => ({ ...prev, prodiId: String(prodis[0].id) }));
        }
      } catch (err) {
        console.error('Error loading prodi:', err);
      }
    };

    if (paramId) {
      Promise.all([
        getSertifikats({ per_page: 500 }),
        loadData(),
      ]).then(([sertifikatsData]) => {
        const allSertifikats = sertifikatsData.data || [];
        const item = allSertifikats.find(x => x.id === Number(paramId));
        if (item) {
          setForm({
            prodiId: String(item.prodis_id),
            jenjang: item.jenjang,
            mulaiAktif: item.mulai_aktif ? item.mulai_aktif.split('T')[0] : '',
            akhirAktif: item.akhir_aktif ? item.akhir_aktif.split('T')[0] : '',
            nilai: item.nilai || '',
            skor: item.skor,
            fileSk: item.file_sk || '',
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      loadData().then(() => setLoading(false));
    }
  }, [paramId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        prodis_id: parseInt(form.prodiId),
        jenjang: form.jenjang,
        mulai_aktif: form.mulaiAktif,
        akhir_aktif: form.akhirAktif,
        nilai: form.nilai.trim() || undefined,
        skor: form.skor,
        file_sk: form.fileSk || undefined,
      };
      if (paramId) {
        await updateSertifikat(Number(paramId), payload);
      } else {
        await createSertifikat(payload);
      }
      navigate('/admin/sertifikat');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate('/admin/sertifikat')} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{paramId ? 'Edit' : 'Tambah'} Sertifikat Akreditasi</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Program Studi</label>
              <SelectInput
                name="prodiId"
                value={form.prodiId}
                onChange={(val) => setForm(prev => ({ ...prev, prodiId: val }))}
                options={prodiList.map(p => ({ value: String(p.id), label: `${p.nama_prodi} (${p.kode_prodi})` }))}
                placeholder="Pilih Program Studi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skor Akreditasi</label>
              <SelectInput
                name="skor"
                value={form.skor}
                onChange={(val) => setForm(prev => ({ ...prev, skor: val }))}
                options={SKOR_OPTS.map(n => ({ value: n, label: n }))}
                placeholder="Pilih Skor"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nilai Akreditasi</label>
              <input
                type="text"
                value={form.nilai}
                onChange={e => setForm(prev => ({ ...prev, nilai: e.target.value }))}
                placeholder="Contoh: 351"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Masa Aktif</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={form.mulaiAktif}
                    onChange={e => setForm(prev => ({ ...prev, mulaiAktif: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={form.akhirAktif}
                    onChange={e => setForm(prev => ({ ...prev, akhirAktif: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">File SK (PDF)</label>
              <FileUpload
                value={form.fileSk}
                onChange={(url) => setForm(prev => ({ ...prev, fileSk: url }))}
                accept=".pdf,application/pdf"
                placeholder="Seret file SK PDF ke sini atau klik untuk memilih"
                helperText="Format: PDF. File akan digunakan untuk tombol Unduh di halaman Sertifikat."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/admin/sertifikat')} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
