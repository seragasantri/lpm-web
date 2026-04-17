import { useEffect } from 'react';
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface Photo {
  id: number;
  src: string;
  caption: string;
  date: string;
  category: 'Audit' | 'Workshop' | 'Pelatihan';
}

const photos: Photo[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
    caption: 'Pelatihan Audit Mutu Internal',
    date: '15 Maret 2025',
    category: 'Pelatihan',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    caption: 'Workshop Penjaminan Mutu',
    date: '22 April 2025',
    category: 'Workshop',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1577415124269-311110d1078c?w=400&h=300&fit=crop',
    caption: 'Auditor Meeting Session',
    date: '10 Mei 2025',
    category: 'Audit',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
    caption: 'Sosialisasi SPMI ke Prodi',
    date: '5 Juni 2025',
    category: 'Workshop',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    caption: 'Evaluasi Diri Program Studi',
    date: '18 Juni 2025',
    category: 'Audit',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    caption: 'Pelatihan Auditor AMI 2025',
    date: '2 Juli 2025',
    category: 'Pelatihan',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    caption: 'Rapat Koordinasi LPMP',
    date: '14 Agustus 2025',
    category: 'Workshop',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    caption: 'Visitasi Akreditasi Prodi',
    date: '28 Agustus 2025',
    category: 'Audit',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    caption: 'Bimtek SPMI Dosen',
    date: '5 September 2025',
    category: 'Pelatihan',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop',
    caption: 'Workshop Menyusun Instrumen AMI',
    date: '20 September 2025',
    category: 'Workshop',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    caption: 'Audit Mutu Eksternal',
    date: '7 Oktober 2025',
    category: 'Audit',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
    caption: 'Pelatihan Evaluasi Diri',
    date: '25 Oktober 2025',
    category: 'Pelatihan',
  },
];

const categories = ['All', 'Audit', 'Workshop', 'Pelatihan'] as const;

export default function GaleriPage() {
  useEffect(() => { document.title = 'Galeri Foto :: LPM UIN Raden Fatah Palembang'; }, []);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Audit' | 'Workshop' | 'Pelatihan'>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer bg-slate-200 aspect-[4/3]"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <span className="text-sky-300 text-xs font-medium mb-1">{photo.category}</span>
                <p className="text-white font-semibold text-sm">{photo.caption}</p>
                <p className="text-slate-300 text-xs mt-0.5">{photo.date}</p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} className="text-slate-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <Camera size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 font-medium">Tidak ada foto dalam kategori ini</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
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
              src={filteredPhotos[currentIndex].src.replace('w=400&h=300', 'w=1200&h=800')}
              alt={filteredPhotos[currentIndex].caption}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center">
              <span className="text-sky-300 text-sm font-medium">
                {filteredPhotos[currentIndex].category}
              </span>
              <h3 className="text-white font-semibold text-lg mt-1">
                {filteredPhotos[currentIndex].caption}
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">{filteredPhotos[currentIndex].date}</p>
              <p className="text-slate-500 text-xs mt-1">
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
