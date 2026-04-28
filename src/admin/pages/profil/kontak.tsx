import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Phone, MapPin, Mail, Globe } from 'lucide-react';
import { getKontak, updateKontak } from '../../../lib/api';

export default function ProfilKontak() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    alamat: '',
    gedung: '',
    telepon: '',
    email: '',
    mapsUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Edit Kontak - Admin LPM';
    getKontak().then((data) => {
      if (data) {
        setForm({
          alamat: data.alamat || '',
          gedung: data.gedung || '',
          telepon: data.telepon || '',
          email: data.email || '',
          mapsUrl: data.maps_url || '',
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.alamat.trim()) { setError('Alamat wajib diisi.'); return; }
    if (!form.telepon.trim()) { setError('Telepon wajib diisi.'); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Format email tidak valid.'); return;
    }

    setSaving(true);
    try {
      await updateKontak({
        alamat: form.alamat.trim(),
        gedung: form.gedung.trim() || '',
        telepon: form.telepon.trim(),
        email: form.email.trim() || '',
        maps_url: form.mapsUrl.trim() || '',
      });
      setSaved(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch {
      setError('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Informasi Kontak</h2>
              <p className="text-sky-200 text-sm mt-0.5">Kelola informasi kontak LPM</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Alamat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Jl. Pangeran Ratu, 5 Ulu, Kec. Jakabaring Kota Palembang Sumatera Selatan, 30252"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gedung</label>
            <input
              type="text"
              name="gedung"
              value={form.gedung}
              onChange={handleChange}
              placeholder="Contoh: Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Telepon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="telepon"
                value={form.telepon}
                onChange={handleChange}
                placeholder="Contoh: +62 895-2491-8613"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Contoh: lpm_uin@radenfatah.ac.id"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maps Embed URL</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="mapsUrl"
                value={form.mapsUrl}
                onChange={handleChange}
                placeholder="Contoh: https://www.google.com/maps/embed?..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Dapatkan URL embed dari Google Maps (bagian Share {'->'} Embed a map)
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
              Berhasil disimpan! Mengalihkan...
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
