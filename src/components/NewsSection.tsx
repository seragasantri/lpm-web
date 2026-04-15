import { Calendar, ArrowRight } from 'lucide-react';
import { newsArticles } from '../data';
import './NewsSection.css';

export default function NewsSection() {
  return (
    <section className="news-section">
      <div className="container">
        <div className="section-header">
          <div className="section-header-icon">
            <span>&#128240;</span>
          </div>
          <div>
            <h2 className="section-title">Berita Terkini</h2>
            <p className="section-subtitle">Informasi dan kegiatan terbaru dari LPM UIN Raden Fatah</p>
          </div>
        </div>

        <div className="news-grid">
          {newsArticles.map((article, index) => (
            <article key={article.id} className={`news-card ${index === 0 ? 'news-card-featured' : ''}`}>
              <div className="news-card-image">
                <img src={`/news-${article.id}.jpg`} alt={article.title} />
                <div className="news-card-date">
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
              </div>
              <div className="news-card-content">
                <h3 className="news-card-title">{article.title}</h3>
                {article.excerpt && (
                  <p className="news-card-excerpt">{article.excerpt}</p>
                )}
                <a href={`/berita/${article.id}`} className="news-card-link">
                  Baca Selengkapnya <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="news-footer">
          <a href="/berita" className="news-all-link">
            Lihat Semua Berita <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
