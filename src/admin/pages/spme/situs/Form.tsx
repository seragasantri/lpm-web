import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Globe } from 'lucide-react';
import SelectInput from '../../../components/SelectInput';
import { createSitus, updateSitus, getSitus } from '../../../../lib/mockData';

const KATEGORI_OPTIONS = [
  { value: 'Akreditasi', label: 'Akreditasi' },
  { value: 'E-Learning', label: 'E-Learning' },
  { value: 'Perpustakaan', label: 'Perpustakaan' },
  { value: 'Perguruan Tinggi', label: 'Perguruan Tinggi' },
  { value: 'Lainnya', label: 'Lainnya' },
];

interface FormState {
  nama: string;
  deskripsi: string;
  url: string;
  kategori: string;
  icon: string;
  urutan: number;
}

const EMPTY_FORM: FormState = {
  nama: '',
  deskripsi: '',
  url: '',
  kategori: 'Akreditasi',
  icon: 'Globe',
  urutan: 1,
};

export default function SpmeSitusForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      getSitus().then((list) => {
        const maxUrutan = list.reduce((max, s) => Math.max(max, s.urutan), 0);
        setForm(prev => ({ ...prev, urutan: maxUrutan + 1 }));
      });
      return;
    }
    setFetching(true);
    getSitus().then((list) => {
      const found = list.find(s => s.id === id);
      if (found) {
        setForm({
          nama: found.nama,
          deskripsi: found.deskripsi,
          url: found.url,
          kategori: found.kategori,
          icon: found.icon,
          urutan: found.urutan,
        });
      } else {
        setError('Data tidak ditemukan.');
      }
    }).catch(() => setError('Gagal memuat data.')).finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nama.trim()) { setError('Nama situs wajib diisi.'); return; }
    if (!form.url.trim()) { setError('URL wajib diisi.'); return; }

    setLoading(true);
    try {
      const payload = {
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim(),
        url: form.url.trim(),
        kategori: form.kategori,
        icon: form.icon.trim() || 'Globe',
        urutan: form.urutan,
      };

      if (isEdit && id) {
        await updateSitus(id, payload);
      } else {
        await createSitus(payload);
      }
      navigate('/admin/spme/situs');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/admin/spme/situs')} className="flex items-center gap-2 text-sky-200 hover:text-white text-sm font-medium transition-colors mb-4">
            <ArrowLeft size={16} />
            Kembali ke Daftar
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Globe size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {isEdit ? 'Edit Situs Terkait' : 'Tambah Situs Terkait'}
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {isEdit ? 'Perbarui informasi situs' : 'Tambahkan situs baru'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col gap-6">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Situs <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={(e) => setForm(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Contoh: BAN-PT"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={(e) => setForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                  rows={2}
                  placeholder="Jelaskan situs ini..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <SelectInput
                    value={form.kategori}
                    onChange={(value) => setForm(prev => ({ ...prev, kategori: value }))}
                    options={KATEGORI_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon (Lucide)</label>
                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Globe"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Nama icon dari lucide-react (contoh: Globe, Shield, Award)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan</label>
                <input
                  type="number"
                  name="urutan"
                  value={form.urutan}
                  onChange={(e) => setForm(prev => ({ ...prev, urutan: Number(e.target.value) }))}
                  min={1}
                  className="w-32 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="mt-1.5 text-xs text-slate-400">Angka kecil tampil lebih awal.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button type="button" onClick={() => navigate('/admin/spme/situs')} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save size={16} /> {isEdit ? 'Simpan Perubahan' : 'Tambah Situs'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}