import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPartner, uploadImage } from '../../../../lib/api';
import { Building2, Save, Loader, ArrowLeft, Upload, X, Image } from 'lucide-react';

export default function PartnerCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    logo_url: '',
    link_url: '',
    urutan: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPartner(formData);
      navigate('/admin/partner');
    } catch (err) {
      console.error('Gagal membuat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData({ ...formData, logo_url: result.url });
    } catch (err) {
      console.error('Gagal upload:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/partner')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tambah Partner</h1>
            <p className="text-slate-500 text-sm">Tambah partner/sertifikasi baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Partner/Sertifikasi</label>
          <input
            type="text"
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
            placeholder="BAN-PT"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Logo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              {formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              <Upload size={16} />
              Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            {formData.logo_url && (
              <button type="button" onClick={() => setFormData({ ...formData, logo_url: '' })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Link</label>
            <input
              type="url"
              value={formData.link_url}
              onChange={e => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://banpt.or.id"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
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
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading || uploading} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
