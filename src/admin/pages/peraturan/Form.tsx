import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPeraturan, createPeraturan, updatePeraturan } from '../../../lib/mockData';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import SelectInput from '../../components/SelectInput';
import FileUpload from '../../components/FileUpload';

const KATEGORI_OPTS = ['Undang-Undang', 'Peraturan Pemerintah', 'Peraturan Presiden', 'Peraturan Menteri', 'Peraturan BAN-PT'];

export default function PeraturanForm({ editId }: { editId?: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const paramId = editId || id;

  const [form, setForm] = useState({ kategori: 'Undang-Undang', nomor: '', judul: '', tahun: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!paramId) return;
    setLoading(true);
    getPeraturan().then(list => {
      const item = list.find(x => x.id === paramId);
      if (item) setForm({ kategori: item.kategori, nomor: item.nomor, judul: item.judul, tahun: item.tahun ?? '', url: item.url ?? '' });
      setLoading(false);
    });
  }, [paramId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (paramId) {
        await updatePeraturan(paramId, form);
      } else {
        await createPeraturan({ ...form, urutan: 0 });
      }
      navigate('/admin/peraturan');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate('/admin/peraturan')} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{paramId ? 'Edit' : 'Tambah'} Peraturan</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
              <SelectInput
                name="kategori"
                value={form.kategori}
                onChange={(val) => setForm(prev => ({ ...prev, kategori: val }))}
                options={KATEGORI_OPTS.map(k => ({ value: k, label: k }))}
                placeholder="Pilih Kategori"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor</label>
              <input value={form.nomor} onChange={set('nomor')} required placeholder="UU No.02/1989" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul</label>
              <input value={form.judul} onChange={set('judul')} required placeholder="Tentang Sistem Pendidikan Nasional" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tahun</label>
              <input value={form.tahun} onChange={set('tahun')} placeholder="2024" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <FileUpload
                label="Dokumen / File"
                value={form.url}
                onChange={(url) => setForm(prev => ({ ...prev, url }))}
                accept=".pdf,.doc,.docx"
                placeholder="Seret file ke sini atau klik untuk memilih"
                helperText="Format: PDF, DOC, DOCX. Maks 10MB."
                preview={false}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/admin/peraturan')} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
