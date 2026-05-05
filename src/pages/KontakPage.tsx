import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contactInfo } from '../data/navigation';
import { getPublicKontak } from '../lib/api';

export default function KontakPage() {
  useEffect(() => { document.title = 'Kontak :: LPM UIN Raden Fatah Palembang'; }, []);

  const [kontak, setKontak] = useState<{ alamat: string; gedung?: string; telepon: string; email: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicKontak();
      if (data) setKontak(data);
    };
    fetchData();
  }, []);

  const mapsUrl = ''; // Can be extended to include maps_url from API

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="container mx-auto">
          <nav className="text-sm text-sky-200 mb-3 flex items-center space-x-2">
            <a href="/" className="hover:text-white transition">Beranda</a>
            <span>/</span>
            <span className="text-white">Kontak</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold">Hubungi Kami</h1>
          <p className="text-sky-200 mt-2 font-medium">Lembaga Penjaminan Mutu UIN Raden Fatah Palembang</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6">
                <h3 className="font-extrabold text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-yellow-300" /> Alamat
                </h3>
              </div>
              <div className="p-6">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {kontak?.alamat ?? contactInfo.address}
                </p>
                <p className="text-slate-500 text-sm mt-3 border-l-2 border-yellow-400 pl-3">
                  {kontak?.gedung ?? contactInfo.building}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6">
                <h3 className="font-extrabold text-lg flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-yellow-300" /> Kontak
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center group">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                    <Phone className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Telepon / WhatsApp</p>
                    <p className="text-slate-800 font-bold">{kontak?.telepon ?? contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                    <Mail className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Email</p>
                    <a href={`mailto:${kontak?.email ?? contactInfo.email}`} className="text-sky-600 font-bold hover:text-yellow-600 transition-colors">
                      {kontak?.email ?? contactInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
                    <Clock className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Jam Operasional</p>
                    <p className="text-slate-800 font-bold">Senin - Jumat: 08.00 - 16.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6">
              <h3 className="font-extrabold text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-yellow-300" /> Peta Lokasi
              </h3>
            </div>
            <div className="p-0">
              {mapsUrl ? (
                <iframe
                  src={mapsUrl}
                  className="w-full h-96 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi LPM UIN Raden Fatah"
                />
              ) : (
                <div className="h-96 bg-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">Peta Lokasi</p>
                    <p className="text-slate-400 text-sm">Jl. Pangeran Ratu, 5 Ulu, Jakabaring</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}