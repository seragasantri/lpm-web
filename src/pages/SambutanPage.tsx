import Layout from '../components/Layout';
import { Quote, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SambutanPage() {
  return (
    <Layout>
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
            <span className="text-white font-medium">Sambutan Ketua LPM</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Sambutan Ketua LPM</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex">
            {/* Yellow left border accent */}
            <div className="w-2 bg-yellow-400 flex-shrink-0" />
            <div className="flex-1 p-8 md:p-12">
              {/* Quote decorative icon */}
              <div className="text-yellow-400 mb-6">
                <Quote className="w-12 h-12" />
              </div>

              {/* Photo and quote layout */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="Ketua LPM UIN Raden Fatah"
                    className="w-48 h-48 rounded-full object-cover ring-4 ring-sky-100"
                  />
                </div>

                {/* Quote text and signature */}
                <div className="flex-1">
                  <blockquote className="text-xl md:text-2xl italic text-slate-600 leading-relaxed mb-8">
                    "Komitmen terhadap mutu adalah sebuah perjalanan yang tidak pernah berakhir. Di LPM UIN Raden Fatah, kami mendedikasikan diri untuk memastikan bahwa setiap proses akademik berjalan sesuai standar tertinggi nasional dan internasional."
                  </blockquote>

                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-slate-800 font-semibold text-lg">
                      Dr. H. Nama Pimpinan, M.Ag.
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Ketua Lembaga Penjaminan Mutu UIN Raden Fatah Palembang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
