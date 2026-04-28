import { useEffect, useState } from 'react';
import { Users, Download, ChevronLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicStruktur } from '../lib/api';

export default function StrukturPage() {
  useEffect(() => { document.title = 'Struktur Organisasi :: LPM UIN Raden Fatah Palembang'; }, []);

  const [struktur, setStruktur] = useState<{ deskripsi?: string; gambar?: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicStruktur();
      if (data) setStruktur(data);
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    if (struktur?.gambar) {
      window.open(struktur.gambar, '_blank');
    } else {
      alert('Struktur organisasi belum tersedia.');
    }
  };

  return (
    <div>
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
            <span className="text-white font-medium">Struktur Organisasi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Struktur Organisasi</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Introduction */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 leading-relaxed">
            {struktur?.deskripsi || 'Struktur Organisasi Lembaga Penjaminan Mutu UIN Raden Fatah Palembang disusun untuk memastikan terlaksananya fungsi penjaminan mutu secara optimal di seluruh unit kerja dalam lingkungan kampus.'}
          </p>
        </div>

        {/* Org Chart */}
        {struktur?.gambar ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <img
              src={struktur.gambar}
              alt="Struktur Organisasi LPM"
              className="max-w-full h-auto rounded-lg"
            />
            <button
              onClick={handleDownload}
              className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              Download Struktur Organisasi
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-sky-50 rounded-full p-6">
                <Users className="w-16 h-16 text-sky-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Struktur Organisasi</h2>
                <p className="text-slate-500">Gambar bagan akan ditampilkan di sini</p>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
                Download Struktur Organisasi
              </button>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-sky-50 rounded-xl border border-sky-200 p-6 flex items-start gap-4">
          <div className="bg-sky-100 rounded-full p-2 flex-shrink-0">
            <Info className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Informasi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Struktur organisasi ini dapat berubah sesuai kebutuhan pengembangan
              institusi dan regulasi yang berlaku. Untuk informasi terbaru, silakan
              hubungi Sekretariat LPM UIN Raden Fatah Palembang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}