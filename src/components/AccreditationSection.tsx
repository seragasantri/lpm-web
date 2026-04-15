import { Award } from 'lucide-react';
import { accreditationData } from '../data';
import './AccreditationSection.css';

export default function AccreditationSection() {
  const total = accreditationData.reduce((sum: number, item) => sum + item.count, 0);

  return (
    <section className="accreditation-section">
      <div className="container">
        <div className="section-header">
          <div className="section-header-icon">
            <Award size={24} />
          </div>
          <div>
            <h2 className="section-title">Akreditasi Program Studi</h2>
            <p className="section-subtitle">
              Total {total} Program Studi — UIN Raden Fatah Palembang
            </p>
          </div>
        </div>

        <div className="accreditation-grid">
          {accreditationData.map((item) => (
            <div key={item.level} className="accreditation-card">
              <div className="accreditation-card-bar">
                <div
                  className="accreditation-card-bar-fill"
                  style={{
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="accreditation-card-info">
                <span className="accreditation-card-level">{item.level}</span>
                <span className="accreditation-card-count" style={{ color: item.color }}>
                  {item.count} Prodi
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="accreditation-visual">
          <div className="accreditation-circle">
            <svg viewBox="0 0 200 200" className="accreditation-svg">
              {(() => {
                let cumulative = 0;
                return accreditationData.map((item) => {
                  const percentage = (item.count / total) * 100;
                  cumulative += percentage;

                  return (
                    <circle
                      key={item.level}
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="24"
                      strokeDasharray={`${percentage} ${100 - percentage}`}
                      strokeDashoffset="25"
                      transform="rotate(-90 100 100)"
                      style={{
                        transform: `rotate(${-90 + (cumulative - percentage) * 3.6}deg)`,
                        transformOrigin: '100px 100px',
                      }}
                    />
                  );
                });
              })()}
              <text x="100" y="92" textAnchor="middle" className="accreditation-total-number">
                {total}
              </text>
              <text x="100" y="112" textAnchor="middle" className="accreditation-total-label">
                Total
              </text>
            </svg>
          </div>

          <div className="accreditation-legend">
            {accreditationData.map((item) => (
              <div key={item.level} className="accreditation-legend-item">
                <span className="accreditation-legend-dot" style={{ backgroundColor: item.color }} />
                <span className="accreditation-legend-text">
                  <strong style={{ color: item.color }}>{item.count}</strong> {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="accreditation-footer">
          <a href="/sertifikat" className="accreditation-link">
            Lihat Detail Sertifikat Akreditasi
          </a>
        </div>
      </div>
    </section>
  );
}
