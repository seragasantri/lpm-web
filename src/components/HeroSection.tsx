import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems } from '../data';
import './HeroSection.css';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="hero">
      {/* Background Pattern */}
      <div className="hero-bg">
        <div className="hero-bg-pattern" />
      </div>

      <div className="hero-content">
        {/* Text Side */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-badge-icon">&#9733;</span>
            Lembaga Penjaminan Mutu
          </div>
          <h1 className="hero-title">
            Selamat Datang di Website <span className="hero-title-accent">LPM</span>
          </h1>
          <h2 className="hero-subtitle">
            UIN Raden Fatah Palembang
          </h2>
          <p className="hero-description">
            Website resmi Lembaga Penjaminan Mutu UIN Raden Fatah Palembang.
            Menyediakan informasi tentang penjaminan mutu, akreditasi, dan sertifikasi ISO
            untuk meningkatkan kualitas pendidikan di lingkungan kampus.
          </p>
          <div className="hero-actions">
            <a href="/profil" className="hero-btn hero-btn-primary">
              Profil LPM
            </a>
            <a href="/visi-dan-misi" className="hero-btn hero-btn-secondary">
              Visi & Misi
            </a>
          </div>
        </div>

        {/* Carousel Side */}
        <div className="hero-carousel">
          <div className="hero-carousel-inner">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className={`hero-carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="hero-carousel-image">
                  <img src={item.image} alt={item.caption} />
                  <div className="hero-carousel-overlay" />
                </div>
                <div className="hero-carousel-caption">
                  <span>{item.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button className="hero-carousel-btn hero-carousel-prev" onClick={prevSlide} aria-label="Slide sebelumnya">
            <ChevronLeft size={24} />
          </button>
          <button className="hero-carousel-btn hero-carousel-next" onClick={nextSlide} aria-label="Slide selanjutnya">
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="hero-carousel-dots">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                className={`hero-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="hero-carousel-counter">
            {currentSlide + 1} / {galleryItems.length}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,100 L0,100 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
