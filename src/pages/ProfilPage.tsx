import { useEffect, useState } from 'react';
import { ShieldCheck, MapPin, Building, Phone, Mail, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicHalaman, getPublicVisiMisi, getPublicKontak } from '../lib/api';
import { contactInfo } from '../data/navigation';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

interface HalamanData { judul: string; konten: string }
interface VisiMisiData { visi: string; items: Array<{ no: number; judul: string; deskripsi: string }> }
interface KontakData { alamat: string; gedung?: string; telepon: string; email: string }

export default function ProfilPage() {
  useEffect(() => { document.title = 'Profil LPM :: LPM UIN Raden Fatah Palembang'; }, []);

  const [halaman, setHalaman] = useState<HalamanData | null>(null);
  const [visimisi, setVisimisi] = useState<VisiMisiData | null>(null);
  const [kontak, setKontak] = useState<KontakData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [h, vm, kt] = await Promise.all([
        getPublicHalaman('profil'),
        getPublicVisiMisi(),
        getPublicKontak(),
      ]);
      if (h) setHalaman(h);
      if (vm) setVisimisi(vm);
      if (kt) setKontak(kt);
    };
    fetchData();
  }, []);

  const missions = visimisi?.items.map(m => m.deskripsi) ?? [
    'Melaksanakan sistem penjaminan mutu internal secara terencana dan kontinyu dengan mengacu kepada standar nasional dan internasional.',
    'Mengkoordinir dan menyiapkan kegiatan penjaminan mutu eksternal melalui akreditasi, baik di tingkat program studi maupun institusi.',
    'Mengkoordinir dan mengarahkan semua bagian/civitas akademik UIN Raden Fatah untuk memenuhi seluruh aspek standar mutu nasional maupun internasional.',
    'Mengkoordinir pelaksanaan penjaminan mutu sistem manajemen (ISO 9001:2015/IWA2) di seluruh bagian UIN Raden Fatah Palembang.',
  ];

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Beranda
            </Link>
            <span>/</span>
            <span>Profil</span>
            <span>/</span>
            <span className="text-white font-medium">{halaman?.judul || 'Profil LPM'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{halaman?.judul || 'Profil LPM'}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        {/* Dynamic Content from DB */}
        {halaman?.konten && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-4">
            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{stripHtml(halaman.konten)}</p>
          </div>
        )}

        {/* Vision Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Visi</h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                {visimisi?.visi ?? 'Menjadi Lembaga Penjaminan Mutu yang Unggul dan Bereputasi Internasional'}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Cards */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Misi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(visimisi?.items ?? missions.map((m) => ({ deskripsi: m }))).map((mission, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">{mission.deskripsi ?? mission}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Informasi Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-sky-100 rounded-full p-2 text-sky-600 flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Alamat</p>
                <p className="text-slate-700">{kontak?.alamat ?? contactInfo.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-sky-100 rounded-full p-2 text-sky-600 flex-shrink-0 mt-0.5">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Gedung</p>
                <p className="text-slate-700">{kontak?.gedung ?? contactInfo.building}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-sky-100 rounded-full p-2 text-sky-600 flex-shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Telepon</p>
                <p className="text-slate-700">{kontak?.telepon ?? contactInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-sky-100 rounded-full p-2 text-sky-600 flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Email</p>
                <p className="text-slate-700">{kontak?.email ?? contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}