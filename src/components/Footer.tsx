import { MapPin, Phone, Mail, User } from 'lucide-react';
import { contactInfo } from '../data/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-950 text-sky-100 border-t-4 border-yellow-400 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 py-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 via-sky-600 to-sky-800 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-lg tracking-wide">UIN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight tracking-wide">
                  LPM UIN Raden Fatah
                </span>
                <span className="text-sky-300 text-xs leading-tight tracking-wide">
                  Lembaga Penjaminan Mutu
                </span>
              </div>
            </div>
            <p className="text-sky-200 text-sm leading-relaxed mb-6">
              Lembaga Penjaminan Mutu UIN Raden Fatah Palembang menjaga dan meningkatkan kualitas pendidikan di lingkungan kampus melalui sistem penjaminan mutu yang komprehensif.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-sky-300 hover:bg-yellow-400 hover:text-sky-950 transition-all duration-200">
                <User size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-sky-300 hover:bg-yellow-400 hover:text-sky-950 transition-all duration-200">
                <User size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-sky-300 hover:bg-yellow-400 hover:text-sky-950 transition-all duration-200">
                <User size={18} />
              </a>
              <a href="#" aria-label="Youtube" className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-sky-300 hover:bg-yellow-400 hover:text-sky-950 transition-all duration-200">
                <User size={18} />
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b-2 border-sky-700">
              Lokasi
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-200 leading-relaxed">
                <p>{contactInfo.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-300 leading-relaxed">
                <p>{contactInfo.building}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b-2 border-sky-700">
              Kontak
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <Phone size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-200 leading-relaxed">
                <p>{contactInfo.phone}</p>
                <p className="text-sky-400 text-xs mt-0.5">(WhatsApp)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-200 leading-relaxed">
                <p>{contactInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b-2 border-sky-700">
              Tautan Penting
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="http://www.radenfatah.ac.id" target="_blank" rel="noopener noreferrer" className="text-sm text-sky-200 hover:text-yellow-400 transition-colors duration-150 inline-flex items-center gap-1.5">
                  UIN Raden Fatah
                </a>
              </li>
              <li>
                <a href="https://www.banpt.or.id" target="_blank" rel="noopener noreferrer" className="text-sm text-sky-200 hover:text-yellow-400 transition-colors duration-150 inline-flex items-center gap-1.5">
                  BAN-PT
                </a>
              </li>
              <li>
                <a href="https://kemendikbudristek.go.id" target="_blank" rel="noopener noreferrer" className="text-sm text-sky-200 hover:text-yellow-400 transition-colors duration-150 inline-flex items-center gap-1.5">
                  KEMENDIKBUD
                </a>
              </li>
              <li>
                <a href="https://kemenag.go.id" target="_blank" rel="noopener noreferrer" className="text-sm text-sky-200 hover:text-yellow-400 transition-colors duration-150 inline-flex items-center gap-1.5">
                  Kemenag RI
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-[#0b1b36] px-4 py-4">
          <div className="text-center text-sm text-sky-400">
            Copyright LPM 2026-{currentYear} Lembaga Penjaminan Mutu UIN Raden Fatah Palembang
          </div>
        </div>
      </div>
    </footer>
  );
}
