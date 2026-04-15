import React from 'react';
import { ExternalLink, BookOpen, FileText, Scale, Building2, Briefcase, Award } from 'lucide-react';
import Layout from '../components/Layout';

interface RegulationCardProps {
  category: string;
  number: string;
  title: string;
  url?: string;
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

function RegulationCard({ category, number, title, url, accentColor, accentBg, icon }: RegulationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${accentBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${accentBg} ${accentColor}`}>
              {category}
            </span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-0.5">{number}</h4>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">{title}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentColor} hover:underline`}
            >
              Lihat Dokumen
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface RegulationGroupProps {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  items: Array<{ number: string; title: string; url?: string }>;
}

function RegulationGroup({ title, icon, accentColor, accentBg, items }: RegulationGroupProps) {
  return (
    <div className="mb-8">
      <h3 className={`text-lg font-bold ${accentColor} mb-4 flex items-center gap-2`}>
        <span className={`w-8 h-8 ${accentBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </span>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <RegulationCard
            key={index}
            category={title}
            number={item.number}
            title={item.title}
            url={item.url}
            accentColor={accentColor}
            accentBg={accentBg}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
}

export default function PeraturanPage() {
  const regulations = [
    {
      title: 'Undang-Undang',
      icon: <Scale size={18} />,
      accentColor: 'text-blue-700',
      accentBg: 'bg-blue-100',
      items: [
        { number: 'UU No. 02 Tahun 1989', title: 'Sistem Pendidikan Nasional', url: '#' },
      ],
    },
    {
      title: 'Peraturan Pemerintah',
      icon: <BookOpen size={18} />,
      accentColor: 'text-emerald-700',
      accentBg: 'bg-emerald-100',
      items: [
        { number: 'PP No. 19 Tahun 2005', title: 'Standar Nasional Pendidikan', url: '#' },
        { number: 'PP No. 32 Tahun 2013', title: 'Perubahan Atas PP No. 19 Tahun 2005', url: '#' },
      ],
    },
    {
      title: 'Peraturan Presiden',
      icon: <Building2 size={18} />,
      accentColor: 'text-yellow-700',
      accentBg: 'bg-yellow-100',
      items: [
        { number: 'Perpres No. 8 Tahun 2012', title: 'Kerangka Kualifikasi Nasional Indonesia (KKNI)', url: '#' },
        { number: 'Perpres No. 62 Tahun 2021', title: 'Kehormatanchnischer Entwicklungsstandinger', url: '#' },
      ],
    },
    {
      title: 'Peraturan Menteri',
      icon: <Briefcase size={18} />,
      accentColor: 'text-purple-700',
      accentBg: 'bg-purple-100',
      items: [
        { number: 'Permen No. 100 Tahun 2016', title: 'Petunjuk Teknis Penggantian Biaya Pendidikan', url: '#' },
        { number: 'Permen No. 062 Tahun 2016', title: 'Sistem Penjaminan Mutu Pendidikan Tinggi (SPMI Dikti)', url: '#' },
        { number: 'Permen No. 032 Tahun 2016', title: 'Akreditasi Program Studi dan Perguruan Tinggi', url: '#' },
        { number: 'Permen No. 044 Tahun 2015', title: 'Standar Nasional Pendidikan Tinggi (SNPT)', url: '#' },
        { number: 'Permen No. 003 Tahun 2020', title: 'Statuta UIN Raden Fatah Palembang', url: '#' },
      ],
    },
    {
      title: 'Peraturan BAN-PT',
      icon: <Award size={18} />,
      accentColor: 'text-orange-700',
      accentBg: 'bg-orange-100',
      items: [
        { number: 'PerBAN-PT Edisi 9', title: 'Panduan Akreditasi Program Studi', url: 'https://banpt.or.id' },
        { number: 'PerBAN-PT Edisi 10', title: 'Panduan Survei Mentor', url: '#' },
        { number: 'PerBAN-PT No. 3 Tahun 2024', title: 'Mekanisme Akreditasi Jarak Jauh', url: '#' },
      ],
    },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Peraturan</h1>
          <p className="text-sky-100">Kumpulan regulasi penjaminan mutu pendidikan tinggi</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-slate-100 rounded-xl p-5 mb-8 flex gap-4 items-start">
          <FileText size={22} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-700 mb-1">Daftar Peraturan Terkait SPMI</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Kumpulan peraturan perundang-undangan dan regulasi yang menjadi dasar dalam pelaksanaan
              Sistem Penjaminan Mutu Internal di lingkungan UIN Raden Fatah Palembang.
            </p>
          </div>
        </div>

        {/* Regulation Groups */}
        {regulations.map((group, index) => (
          <RegulationGroup key={index} {...group} />
        ))}

        {/* Download All */}
        <div className="mt-6 flex justify-end">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <FileText size={16} />
            Unduh Kompilasi Peraturan
          </a>
        </div>
      </div>
    </Layout>
  );
}
