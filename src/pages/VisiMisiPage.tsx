import { useEffect } from 'react';
import { Target, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MissionItem {
  number: number;
  title: string;
  description: string;
}

const missions: MissionItem[] = [
  {
    number: 1,
    title: 'Penjaminan Mutu Internal',
    description: 'Melaksanakan sistem penjaminan mutu internal secara terencana dan kontinyu dengan mengacu kepada standar nasional dan internasional.',
  },
  {
    number: 2,
    title: 'Akreditasi Eksternal',
    description: 'Mengkoordinir dan menyiapkan kegiatan penjaminan mutu eksternal melalui akreditasi, baik di tingkat program studi maupun institusi.',
  },
  {
    number: 3,
    title: 'Koordinasi Civitas Akademika',
    description: 'Mengkoordinir dan mengarahkan semua bagian/civitas akademik UIN Raden Fatah untuk memenuhi seluruh aspek standar mutu nasional maupun internasional.',
  },
  {
    number: 4,
    title: 'Sistem Manajemen ISO',
    description: 'Mengkoordinir pelaksanaan penjaminan mutu sistem manajemen (ISO 9001:2015/IWA2) di seluruh bagian UIN Raden Fatah Palembang.',
  },
];

const accreditationLevels = [
  { label: 'Unggul', count: 34, color: 'bg-green-600', textColor: 'text-green-600' },
  { label: 'Akreditasi A', count: 4, color: 'bg-blue-600', textColor: 'text-blue-600' },
  { label: 'Akreditasi B', count: 1, color: 'bg-yellow-600', textColor: 'text-yellow-600' },
  { label: 'Baik Sekali', count: 7, color: 'bg-purple-600', textColor: 'text-purple-600' },
];

export default function VisiMisiPage() {
  useEffect(() => { document.title = 'Visi dan Misi :: LPM UIN Raden Fatah Palembang'; }, []);
  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sky-200 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Beranda
            </Link>
            <span>/</span>
            <span>Profil</span>
            <span>/</span>
            <span className="text-white font-medium">Visi dan Misi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Visi dan Misi</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Vision Hero Card */}
        <div className="bg-gradient-to-br from-sky-700 to-sky-800 rounded-2xl p-10 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Visi</h2>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            Menjadi Lembaga Penjaminan Mutu yang Unggul dan Bereputasi Internasional
          </p>
        </div>

        {/* Mission Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Misi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map((mission) => (
              <div
                key={mission.number}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl">
                    {mission.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2 text-lg">{mission.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{mission.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditation Stats */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Capaian Akreditasi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accreditationLevels.map((level) => (
              <div
                key={level.label}
                className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${level.color} text-white mb-4`}>
                  <span className="text-2xl font-bold">{level.count}</span>
                </div>
                <p className={`font-semibold ${level.textColor}`}>{level.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
