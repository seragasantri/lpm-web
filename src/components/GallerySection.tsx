import { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems } from '../data';
import './GallerySection.css';

export default function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % galleryItems.length);
  };

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header">
          <div className="section-header-icon">
            <Camera size={24} />
          </div>
          <div>
            <h2 className="section-title">Galeri Kegiatan</h2>
            <p className="section-subtitle">Dokumentasi kegiatan LPM UIN Raden Fatah Palembang</p>
          </div>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              className="gallery-item"
              onClick={() => openLightbox(index)}
              aria-label={`Lihat ${item.caption}`}
            >
              <img src={item.image} alt={item.caption} />
              <div className="gallery-item-overlay">
                <Camera size={24} />
                <span>{item.caption}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="gallery-footer">
          <a href="/galeri-foto" className="gallery-all-link">
            Lihat Semua Galeri
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Tutup">
            <X size={28} />
          </button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Sebelumnya">
            <ChevronLeft size={32} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={galleryItems[selectedIndex].image} alt={galleryItems[selectedIndex].caption} />
            <div className="lightbox-caption">
              <span className="lightbox-counter">{selectedIndex + 1} / {galleryItems.length}</span>
              <p className="lightbox-title">{galleryItems[selectedIndex].caption}</p>
            </div>
          </div>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Selanjutnya">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
}
