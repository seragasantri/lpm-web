import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuickAccessItem } from '../../../../lib/api';
import { Link2, Save, Loader, ArrowLeft } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Monitor', label: 'Monitor/SIAMI' },
  { value: 'FileText', label: 'Dokumen/BKD' },
  { value: 'CheckCircle', label: 'Checklist/SPMI' },
  { value: 'Award', label: 'Award/Sertifikasi' },
  { value: 'BookOpen', label: 'Buku/Pedoman' },
  { value: 'Users', label: 'Users/Team' },
  { value: 'ShieldCheck', label: 'Shield/Keamanan' },
  { value: 'Globe', label: 'Globe/Web' },
];

export default function QuickAccessCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    icon: 'Monitor',
    link_url: '',
    urutan: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createQuickAccessItem(formData);
      navigate('/admin/quick-access');
    } catch (err) {
      console.error('Gagal membuat:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/quick-access')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tambah Menu Cepat</h1>
            <p className="text-slate-500 text-sm">Tambah menu cepat baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Menu</label>
            <input
              type="text"
              value={formData.judul}
              onChange={e => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Sistem SIAMI"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
            <input
              type="text"
              value={formData.deskripsi}
              onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Audit Internal Online"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon</label>
            <select
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {ICON_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Link</label>
            <input
              type="url"
              value={formData.link_url}
              onChange={e => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://siami.radenfatah.ac.id"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan Tampilan</label>
          <input
            type="number"
            value={formData.urutan}
            onChange={e => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
            min={1}
            className="w-32 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
