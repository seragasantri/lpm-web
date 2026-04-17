import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getFooter, updateFooter } from '../../../lib/mockData';
import type { FooterData } from '../../../lib/types';
import { Globe, Save, Loader, Phone, Mail, MapPin } from 'lucide-react';
import Textarea from '../../components/Textarea';

export default function FooterIndex() {
  useEffect(() => { document.title = 'Manajemen Footer :: LPM Admin'; }, []);
  const { hasPermission } = useAuth();

  const [alamat, setAlamat] = useState('');
  const [gedung, setGedung] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [copyright, setCopyright] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getFooter().then(data => {
      setAlamat(data.alamat);
      setGedung(data.gedung);
      setTelepon(data.telepon);
      setEmail(data.email);
      setFacebook(data.socials.facebook ?? '');
      setTwitter(data.socials.twitter ?? '');
      setInstagram(data.socials.instagram ?? '');
      setYoutube(data.socials.youtube ?? '');
      setCopyright(data.copyright);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Partial<FooterData> = {
        alamat, gedung, telepon, email,
        socials: { facebook, twitter, instagram, youtube },
        copyright,
      };
      await updateFooter(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  );

  if (!hasPermission('footer.update')) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        Anda tidak memiliki akses untuk mengelola footer.
      </div>
    </div>
  );

  const inputCls = "w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Manajemen Footer</h1>
            <p className="text-sky-100 text-sm mt-0.5">Kelola informasi kontak dan sosial media</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-8">
        {/* Info Kontak */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-sky-600" /> Info Kontak
          </h3>
          <div className="space-y-4">
            <div>
              <Textarea
                label="Alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Jl. Pangeran Ratu, 5 Ulu..."
                rows={2}
              />
            </div>
            <div>
              <label className={labelCls}>Gedung / Lokasi</label>
              <input value={gedung} onChange={e => setGedung(e.target.value)} className={inputCls} placeholder="Gedung Kantor Pusat Administrasi Lantai 4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Telepon</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={telepon} onChange={e => setTelepon(e.target.value)} className={`${inputCls} pl-9`} placeholder="+62 895-2491-8613" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputCls} pl-9`} placeholder="lpm_uin@radenfatah.ac.id" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Social Media */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Globe size={16} className="text-sky-600" /> Social Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Facebook URL</label>
              <input value={facebook} onChange={e => setFacebook(e.target.value)} type="url" className={inputCls} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={labelCls}>Twitter URL</label>
              <input value={twitter} onChange={e => setTwitter(e.target.value)} type="url" className={inputCls} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input value={instagram} onChange={e => setInstagram(e.target.value)} type="url" className={inputCls} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={labelCls}>YouTube URL</label>
              <input value={youtube} onChange={e => setYoutube(e.target.value)} type="url" className={inputCls} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Copyright */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4">Copyright</h3>
          <input value={copyright} onChange={e => setCopyright(e.target.value)} className={inputCls} placeholder="Copyright PUSTIPD © 2018-2026" />
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
            Footer berhasil disimpan!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save size={16} />} Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
