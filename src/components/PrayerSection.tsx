import { Moon, Sunrise, Sun, Sunset, Compass } from 'lucide-react';
import { prayerTimes, location } from '../data';
import './PrayerSection.css';

const getIcon = (name: string) => {
  switch (name) {
    case 'Imsak': return <Moon size={16} />;
    case 'Subuh': return <Sunrise size={16} />;
    case 'Syuruq': return <Sun size={16} />;
    case 'Dzuhur': return <Sun size={16} />;
    case 'Ashar': return <Sun size={16} />;
    case 'Maghrib': return <Sunset size={16} />;
    case 'Isya': return <Moon size={16} />;
    default: return <Sun size={16} />;
  }
};

export default function PrayerSection() {
  return (
    <div className="prayer-section">
      <div className="prayer-header">
        <Compass size={20} className="prayer-header-icon" />
        <h3 className="prayer-title">Jadwal Sholat</h3>
        <span className="prayer-location">Palembang</span>
      </div>

      <div className="prayer-list">
        {prayerTimes.map((prayer, index) => (
          <div key={prayer.name} className={`prayer-item ${index === 3 ? 'prayer-item-active' : ''}`}>
            <div className="prayer-item-left">
              <span className="prayer-item-icon">{getIcon(prayer.name)}</span>
              <span className="prayer-item-arabic">{prayer.arabic}</span>
              <span className="prayer-item-name">{prayer.name}</span>
            </div>
            <span className="prayer-item-time">{prayer.time} WIB</span>
          </div>
        ))}
      </div>

      <div className="prayer-footer">
        <div className="prayer-location-info">
          <span>{location.coordinates}</span>
          <span>Ketinggian: {location.elevation}</span>
          <span>Arah Kiblat: {location.kiblat}</span>
        </div>
      </div>
    </div>
  );
}
