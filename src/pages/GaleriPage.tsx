import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Loader } from 'lucide-react';
import { getPublicGaleris, type GaleriResponse } from '../lib/api';

const API_FILE = import.meta.env.VITE_API_FILE || 'https://api-lpm.test';

const KATEGORI_COLORS: Record<string, string> = {
  Audit: 'bg-blue-500',
  Workshop: 'bg-green-500',
  Pelatihan: 'bg-amber-500',
  Lainnya: 'bg-slate-500',
};

export default function GaleriPage() {
  useEffect(() => { document.title = 'Galeri Foto :: LPM UIN Raden Fatah Palembang'; }, []);

  const [photos, setPhotos] = useState<GaleriResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch galeri photos
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const data = await getPublicGaleris({ per_page: 100 });
        setPhotos(data || []);

        // Extract unique categories
        const uniqueCategories = [...new Set((data || []).map((p) => p.kategori))];
        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('GaleriPage: Error:', err);
        setError(err instanceof Error ? err.message : 'Gagal mengambil data');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.kategori === activeCategory);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    // Jika sudah full URL, gunakan langsung
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path.replace(/\\/g, '');
    }
    // Jika hanya path, gabungkan dengan base URL
    return `${API_FILE}${path}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Camera size={48} className="mx-auto text-red-300 mb-3" />
          <p className="text-red-500 font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Galeri Foto</h1>
          <p className="text-sky-100">Dokumentasi kegiatan penjaminan mutu</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeCategory === category
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer bg-slate-200 aspect-[4/3]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={getImageUrl(photo.gambar)}
                  alt={photo.judul}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                  <span className={`${KATEGORI_COLORS[photo.kategori] || 'bg-slate-500'} text-white text-xs font-medium px-2 py-0.5 rounded mb-2 w-fit`}>
                    {photo.kategori}
                  </span>
                  <p className="text-white font-semibold text-sm">{photo.judul}</p>
                  <p className="text-slate-300 text-xs mt-0.5">{formatDate(photo.tanggal)}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={14} className="text-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 font-medium">Belum ada foto galeri</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && filteredPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Tutup"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Prev Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          {/* Image */}
          <div className="max-w-4xl w-full mx-4 relative">
            <img
              src={getImageUrl(filteredPhotos[currentIndex].gambar)}
              alt={filteredPhotos[currentIndex].judul}
              className="w-full max-h-[75vh] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
            <div className="mt-4 text-center">
              <span className={`${KATEGORI_COLORS[filteredPhotos[currentIndex].kategori] || 'bg-slate-500'} text-white text-sm font-medium px-2 py-0.5 rounded`}>
                {filteredPhotos[currentIndex].kategori}
              </span>
              <h3 className="text-white font-semibold text-lg mt-2">
                {filteredPhotos[currentIndex].judul}
              </h3>
              <p className="text-slate-400 text-sm mt-1">{formatDate(filteredPhotos[currentIndex].tanggal)}</p>
              <p className="text-slate-500 text-xs mt-2">
                {currentIndex + 1} / {filteredPhotos.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
