import { useState, useEffect } from 'react';
import {
  Info, FileText, CheckCircle, Download,
  Calendar, Clock, BarChart2, BookOpen,
  ArrowRight, Monitor, Award, Target, Users,
  ShieldCheck, Play, Quote, Building, Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PRAYER_TIMES = [
  { name: 'Imsak', time: '04:33 WIB' },
  { name: 'Subuh', time: '04:43 WIB' },
  { name: 'Syuruq', time: '05:59 WIB' },
  { name: 'Dzuhur', time: '12:03 WIB' },
  { name: 'Ashar', time: '15:20 WIB' },
  { name: 'Maghrib', time: '18:04 WIB' },
  { name: 'Isya', time: '19:13 WIB' },
];

const LATEST_NEWS = [
  {
    id: 1,
    category: 'Akreditasi',
    title: 'LPM UIN Raden Fatah Gaungkan Pentingnya Mutu dan Akreditasi dalam Apel Pagi Rektorat',
    date: '13/04/2026 08:52:24 WIB',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600&h=400',
    excerpt: 'Sosialisasi dan penguatan komitmen mutu terus digaungkan di lingkungan UIN Raden Fatah sebagai langkah strategis mencapai akreditasi unggul tingkat internasional.'
  },
  {
    id: 2,
    category: 'SPMI',
    title: 'Sinergi LPM dan Senat UIN Raden Fatah dalam Penyempurnaan Dokumen SPMI',
    date: '13/04/2026 08:38:22 WIB',
    image: 'https://images.unsplash.com/photo-1577415124269-311110d1078c?auto=format&fit=crop&q=80&w=600&h=400',
    excerpt: 'Langkah strategis diambil melalui rapat sinergi antara LPM dan jajaran Senat Universitas untuk memastikan standar pendidikan terpenuhi secara konsisten.'
  },
  {
    id: 3,
    category: 'Inovasi Digital',
    title: 'Dukung Transformasi Digital, Tim LPM UIN Raden Fatah Ikuti Pelatihan AI Gemini Academy',
    date: '11/03/2026 13:37:41 WIB',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400',
    excerpt: 'Adopsi teknologi kecerdasan buatan menjadi fokus utama dalam peningkatan efisiensi penjaminan mutu dan tata kelola dokumen di era digital.'
  },
  {
    id: 4,
    category: 'Sertifikasi',
    title: 'Perkuat Profesionalisme Dosen, LPM UIN Raden Fatah Serahkan 104 Sertifikat Serdos PTKI',
    date: '11/03/2026 11:17:19 WIB',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600&h=400',
    excerpt: 'Sebanyak 104 dosen menerima sertifikat pendidik sebagai bukti profesionalisme dan kompetensi pengajaran di perguruan tinggi keagamaan Islam.'
  }
];

const DOWNLOADS = [
  { id: 1, title: 'Link Penyerahan Instrumen yang Telah diisi Auditee', date: '22/07/2022' },
  { id: 2, title: 'Formulir AMI Auditor 2022', date: '21/07/2022' },
  { id: 3, title: 'Instrumen AMI Fakultas UPPS 2022', date: '22/07/2022' },
  { id: 4, title: 'Instrumen AMI KPA 2022', date: '22/07/2022' },
];

const QUICK_ACTIVITIES = [
  'Audit Mutu Internal', 'Selamat dan Sukses', 'Audit ISO 9001:2015',
  'Audit Mutu Internal 2024', 'Monev GPMF', 'Workshop OBE',
  'Refreshment Auditor AMI', 'Pelatihan Kurikulum', 'Forum Penjaminan Mutu'
];

const STATS = [
  { number: '104+', label: 'Program Studi', icon: Target },
  { number: 'A / Unggul', label: 'Akreditasi Institusi', icon: Award },
  { number: '150+', label: 'Auditor Internal', icon: Users },
  { number: 'ISO 9001', label: 'Tersertifikasi', icon: ShieldCheck },
];

function MobileNavItem({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-3.5 text-base font-bold text-white hover:bg-sky-900 border-b border-sky-700/50 rounded-lg transition-colors"
    >
      {title}
    </button>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('Beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Timer for current time display
  }, []);

  useEffect(() => {
    // Scroll handler
  }, []);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">



      {/* Spacer for absolute nav */}
      <div className="h-12 hidden lg:block"></div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-sky-800 text-white p-4 max-h-96 overflow-y-auto shadow-inner fixed w-full z-40 top-[70px]">
          <div className="flex flex-col space-y-1">
            <MobileNavItem title="Beranda" onClick={() => handleNavClick('Beranda')} />
            <MobileNavItem title="Profil" onClick={() => handleNavClick('Profil')} />
            <MobileNavItem title="SPME" onClick={() => handleNavClick('SPME')} />
            <MobileNavItem title="SPMI" onClick={() => handleNavClick('SPMI')} />
            <MobileNavItem title="SIAMI" onClick={() => handleNavClick('SIAMI')} />
            <MobileNavItem title="BKD Online" onClick={() => handleNavClick('BKD Online')} />
            <MobileNavItem title="CDC" onClick={() => handleNavClick('CDC')} />
            <MobileNavItem title="Galeri Foto" onClick={() => handleNavClick('Galeri Foto')} />
            <MobileNavItem title="Sertifikat" onClick={() => handleNavClick('Sertifikat')} />
            <MobileNavItem title="Peraturan" onClick={() => handleNavClick('Peraturan')} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {currentPage === 'Beranda' ? (
          <BerandaContent onNavigate={handleNavClick} />
        ) : (
          <DynamicPageContent pageName={currentPage} onBack={() => handleNavClick('Beranda')} />
        )}
      </main>


    </div>
  );
}

function BerandaContent({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-12">

      {/* HERO */}
      <div className="relative rounded-2xl shadow-xl overflow-hidden h-[480px] md:h-[550px] flex items-center group">
        <div
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[10s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900 via-sky-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-sky-900/20"></div>

        <div className="relative z-10 px-8 md:px-16 w-full md:w-[70%]">
          <div className="flex items-center mb-4 space-x-2">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-sky-900 text-xs font-bold shadow-md">Portal Terpadu</span>
            <span className="text-sky-200 text-sm font-medium border-l border-sky-600 pl-2">Sistem Penjaminan Mutu</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-lg">
            Sinergi Menuju<br />
            <span className="text-yellow-400 inline-block mt-1">Mutu Unggul & Global</span>
          </h2>
          <p className="text-lg md:text-xl text-sky-100 mb-8 max-w-xl font-medium leading-relaxed drop-shadow">
            Membangun budaya mutu berkelanjutan melalui penerapan Sistem Penjaminan Mutu Internal (SPMI) yang kredibel dan transparan di UIN Raden Fatah.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onNavigate('Profil')}
              className="bg-yellow-400 text-sky-900 px-7 py-3.5 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] flex items-center justify-center transform hover:-translate-y-1"
            >
              Jelajahi Profil <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="bg-white/10 text-white border border-white/30 px-7 py-3.5 rounded-lg font-bold hover:bg-white hover:text-sky-900 transition-all duration-300 backdrop-blur-md flex items-center justify-center transform hover:-translate-y-1">
              <Play className="w-5 h-5 mr-2" /> Tonton Video Profil
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="w-10 h-2 bg-yellow-400 rounded-full cursor-pointer shadow-md"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full cursor-pointer hover:bg-white transition-all hover:scale-125"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full cursor-pointer hover:bg-white transition-all hover:scale-125"></div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-16 md:-mt-24 relative z-20 px-2 md:px-8">
        {[
          { title: 'Sistem SIAMI', desc: 'Audit Internal Online', icon: Monitor, color: 'text-blue-500' },
          { title: 'BKD Online', desc: 'Beban Kerja Dosen', icon: FileText, color: 'text-orange-500' },
          { title: 'Instrumen SPMI', desc: 'Dokumen & Template', icon: CheckCircle, color: 'text-green-500' },
          { title: 'Sertifikasi', desc: 'Serdos & Kompetensi', icon: Award, color: 'text-purple-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-center flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-sky-50 transition-colors shadow-inner`}>
              <item.icon className={`w-8 h-8 ${item.color} transform group-hover:scale-110 transition-transform`} />
            </div>
            <h3 className="font-bold text-sky-900 group-hover:text-sky-600 transition-colors text-lg">{item.title}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* SAMBUTAN */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden relative p-1 mt-8">
        <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400 rounded-l-3xl"></div>
        <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-sky-100 shadow-xl overflow-hidden flex-shrink-0 relative">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" alt="Ketua LPM" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative">
            <Quote className="absolute -top-6 -left-6 w-16 h-16 text-sky-50 opacity-50 transform -scale-x-100" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-sky-900 mb-2">Sambutan Ketua LPM</h3>
            <p className="text-lg text-slate-600 italic leading-relaxed mb-6 font-medium relative z-10">
              "Komitmen terhadap mutu adalah sebuah perjalanan yang tidak pernah berakhir. Di LPM UIN Raden Fatah, kami mendedikasikan diri untuk memastikan bahwa setiap proses akademik berjalan sesuai standar tertinggi nasional dan internasional."
            </p>
            <div>
              <p className="font-bold text-sky-900">Dr. H. Nama Pimpinan, M.Ag.</p>
              <p className="text-sm text-yellow-600 font-semibold">Ketua Lembaga Penjaminan Mutu</p>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-1.5 flex items-center shadow-sm relative overflow-hidden">
        <div className="bg-sky-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg whitespace-nowrap z-10 flex items-center shadow-md">
          <Info className="w-4 h-4 mr-2" /> INFO TERKINI
        </div>
        <div className="flex-1 overflow-hidden ml-4 relative">
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-sky-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-sky-50 to-transparent z-10"></div>
          <div className="flex space-x-8 text-sm font-semibold text-sky-900 whitespace-nowrap overflow-x-auto py-2">
            {QUICK_ACTIVITIES.map((activity, idx) => (
              <span key={idx} className="flex items-center cursor-pointer hover:text-sky-600 transition-colors">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 shadow-sm"></span> {activity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* NEWS + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
            <h3 className="text-2xl font-black text-sky-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-sky-500" /> Berita Terkini
            </h3>
            <Link to="/berita" className="text-sm text-sky-700 hover:text-sky-900 font-bold bg-slate-100 hover:bg-yellow-400 px-5 py-2 rounded-full transition-all duration-300 flex items-center">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-6">
            {LATEST_NEWS.map((news) => (
              <div key={news.id} className="group flex flex-col md:flex-row bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 overflow-hidden transform hover:-translate-y-1">
                <Link to={`/berita/${news.id}`} className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute top-4 left-4 bg-yellow-400 text-sky-900 text-xs font-extrabold px-3 py-1.5 rounded-md shadow-md uppercase tracking-wider">
                    {news.category}
                  </div>
                </Link>
                <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs text-sky-600 mb-3 font-semibold bg-sky-50 inline-block px-2.5 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5 mr-1 inline" /> {news.date}
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/berita/${news.id}`}>{news.title}</Link>
                    </h4>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{news.excerpt}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <Link to={`/berita/${news.id}`} className="text-sm font-bold text-sky-600 flex items-center group-hover:text-yellow-600 transition-colors">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">

          {/* Sholat */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-bl-full opacity-20 transform group-hover:scale-110 transition-transform duration-700"></div>
            <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white p-6 flex justify-between items-center relative z-10">
              <div>
                <h4 className="font-extrabold text-lg flex items-center"><Clock className="w-5 h-5 mr-2 text-yellow-300" /> Jadwal Sholat</h4>
                <p className="text-xs text-sky-200 mt-1 font-medium">Wilayah Palembang & Sekitarnya</p>
              </div>
            </div>
            <div className="p-6 relative z-10">
              <div className="text-center mb-5 pb-4 border-b border-dashed border-slate-200">
                <p className="font-bold text-sky-900 text-lg">Kota Palembang</p>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-mono font-bold">2°59'LS, 104°47'BT</span>
              </div>
              <ul className="space-y-2.5">
                {PRAYER_TIMES.map((pt, idx) => (
                  <li key={idx} className={`flex justify-between text-sm py-2.5 px-4 rounded-xl ${pt.name === 'Dzuhur' ? 'bg-sky-50 border border-sky-100 font-bold shadow-sm' : 'hover:bg-slate-50 border border-transparent'} transition-all`}>
                    <span className={`font-medium ${pt.name === 'Dzuhur' ? 'text-sky-700' : 'text-slate-600'}`}>{pt.name}</span>
                    <span className={pt.name === 'Dzuhur' ? 'text-sky-700' : 'text-sky-900 font-semibold'}>{pt.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Download */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-yellow-400 text-sky-900 p-6 flex justify-between items-center">
              <h4 className="font-extrabold text-lg flex items-center"><Download className="w-5 h-5 mr-2" /> Dokumen Unduhan</h4>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {DOWNLOADS.map((doc) => (
                  <li key={doc.id} className="flex items-start group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mr-4 group-hover:bg-yellow-100 group-hover:text-yellow-600 text-sky-500 transition-colors flex-shrink-0 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <a href="#" className="text-sm font-bold text-slate-700 group-hover:text-sky-700 line-clamp-2 leading-tight transition-colors">{doc.title}</a>
                      <span className="text-xs text-slate-400 block mt-1.5 font-medium">{doc.date} WIB</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 py-3 bg-slate-50 text-sky-700 text-sm font-bold rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm border border-slate-200 hover:border-transparent">
                Lihat Semua Dokumen
              </button>
            </div>
          </div>

          {/* Polling */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-800 text-white p-6 flex justify-between items-center">
              <h4 className="font-extrabold text-lg flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-yellow-400" /> Jajak Pendapat</h4>
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-slate-50">
              <p className="text-sm font-bold text-sky-900 mb-5 leading-relaxed text-center">
                "Bagaimana Pendapat Anda tentang pelayanan dan informasi Website LPM ini?"
              </p>
              <form className="space-y-3 mb-2" onSubmit={(e) => e.preventDefault()}>
                {['Sangat Bagus & Membantu', 'Cukup Bagus', 'Biasa Saja', 'Perlu Perbaikan'].map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all bg-white shadow-sm hover:shadow-md">
                    <input type="radio" name="poll" className="w-4 h-4 text-sky-600 focus:ring-sky-500" />
                    <span className="text-sm text-slate-700 font-bold">{option}</span>
                  </label>
                ))}
                <div className="pt-5 flex flex-col space-y-3">
                  <button type="button" className="w-full bg-sky-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-sky-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Kirim Jawaban
                  </button>
                  <button type="button" className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                    Lihat Hasil Polling
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* PARTNER */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-8">Diakui Oleh & Tersertifikasi</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center space-x-2 font-black text-2xl text-slate-800"><Building className="w-8 h-8" /> BAN-PT</div>
          <div className="flex items-center space-x-2 font-black text-2xl text-slate-800"><Globe className="w-8 h-8" /> ISO 9001:2015</div>
          <div className="flex items-center space-x-2 font-black text-2xl text-slate-800"><Building className="w-8 h-8" /> KEMENAG RI</div>
          <div className="flex items-center space-x-2 font-black text-2xl text-slate-800"><Globe className="w-8 h-8" /> AUN-QA</div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-gradient-to-br from-sky-800 to-sky-900 rounded-3xl shadow-2xl overflow-hidden mt-12 relative border border-sky-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-sky-700/50 relative z-10">
          {STATS.map((stat, idx) => (
            <div key={idx} className="p-8 md:p-10 text-center group hover:bg-sky-700/30 transition-all duration-300 cursor-default">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-sky-900/50 flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-inner">
                  <stat.icon className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <h4 className="text-3xl md:text-4xl font-black text-white mb-2">{stat.number}</h4>
              <p className="text-sky-200 font-semibold text-sm md:text-base uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DynamicPageContent({ pageName, onBack }: { pageName: string; onBack: () => void }) {
  return (
    <div className="py-20 px-4 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[60vh] flex flex-col items-center justify-center text-center relative overflow-hidden mt-8">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
        <Monitor className="w-[400px] h-[400px] text-sky-500" />
      </div>
      <div className="relative z-10">
        <div className="w-24 h-24 bg-sky-50 border-4 border-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-sky-900 mb-4">{pageName}</h2>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed mb-10 font-medium">
          Ini adalah pratinjau antarmuka untuk <strong>{pageName}</strong>. Halaman ini sedang dalam pengembangan dan akan segera hadir dengan konten lengkap.
        </p>
        <button
          onClick={onBack}
          className="px-8 py-3.5 bg-sky-600 text-white rounded-full font-bold hover:bg-sky-700 hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center mx-auto"
        >
          <ArrowRight className="w-5 h-5 mr-2 transform rotate-180" /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
