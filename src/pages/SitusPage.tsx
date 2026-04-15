import React from 'react';
import {
  Globe, ExternalLink, BookOpen, Library, Monitor,
  Users, Award, GraduationCap, FileText, Shield,
  BarChart2, School, Database, ShoppingBag
} from 'lucide-react';
import Layout from '../components/Layout';

interface SiteCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  url: string;
}

function SiteCard({ icon, name, description, url }: SiteCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-sky-200 transition-all duration-200 group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 group-hover:scale-110 transition-all">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800 text-sm">{name}</h3>
      </div>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-800 text-sm font-medium transition-colors"
      >
        Kunjungi
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default function SitusPage() {
  const sites = [
    {
      icon: <Shield size={20} />,
      name: 'SIAMI',
      description: 'Sistem Informasi Akreditasi Mandiri Instrumen untuk pemantauan dan evaluasi akreditasi program studi.',
      url: 'https://sialim.kemdikbud.go.id',
    },
    {
      icon: <Database size={20} />,
      name: 'BKD Online',
      description: 'Sistem informasi daring untuk pengelolaan data dosen dan pengembangan karir tenaga pendidik.',
      url: '#',
    },
    {
      icon: <GraduationCap size={20} />,
      name: 'UIN Raden Fatah',
      description: 'Website resmi Universitas Islam Negeri Raden Fatah Palembang sebagai institusi parent.',
      url: 'https://uin-rfatah.ac.id',
    },
    {
      icon: <BookOpen size={20} />,
      name: 'Open Jurnal Sistem',
      description: 'Sistem pengelolaan jurnal ilmiah terbuka UIN Raden Fatah untuk publikasi penelitian.',
      url: '#',
    },
    {
      icon: <BarChart2 size={20} />,
      name: 'e-Kinerja',
      description: 'Sistem informasi kinerja daring untuk evaluasi dan pelaporan kinerja civitas akademika.',
      url: '#',
    },
    {
      icon: <Library size={20} />,
      name: 'e-Prints',
      description: 'Repository digital untuk menyimpan dan mengakses karya ilmiah, tesis, dan disertasi.',
      url: '#',
    },
    {
      icon: <ShoppingBag size={20} />,
      name: 'LPSE',
      description: 'Layanan Pengadaan Secara Elektronik untuk proses pengadaan barang dan jasa yang transparan.',
      url: '#',
    },
    {
      icon: <BookOpen size={20} />,
      name: 'Perpustakaan',
      description: 'Sistem manajemen perpustakaan digital UIN Raden Fatah untuk akses koleksi pustaka.',
      url: '#',
    },
    {
      icon: <Monitor size={20} />,
      name: 'e-Learning',
      description: 'Platform pembelajaran elektronik untuk mendukung kegiatan belajar mengajar daring.',
      url: '#',
    },
    {
      icon: <FileText size={20} />,
      name: 'Sialin',
      description: 'Sistem Informasi Akreditasi Online untuk pengelolaan data akreditasi program studi.',
      url: 'https://sialim.kemdikbud.go.id',
    },
    {
      icon: <Users size={20} />,
      name: 'CDC',
      description: 'Career Development Center untuk pengembangan karir dan hubungan industri alumni.',
      url: '#',
    },
    {
      icon: <Award size={20} />,
      name: 'BAN-PT',
      description: 'Badan Akreditasi Nasional Perguruan Tinggi untuk akreditasi institusi dan program studi.',
      url: 'https://banpt.or.id',
    },
    {
      icon: <School size={20} />,
      name: 'Kemendikbud',
      description: 'Kementerian Pendidikan dan Kebudayaan Republik Indonesia sebagai regulator pendidikan.',
      url: 'https://kemendikbud.go.id',
    },
    {
      icon: <Shield size={20} />,
      name: 'Kemenag',
      description: 'Kementerian Agama Republik Indonesia untuk pengelolaan pendidikan keagamaan Islam.',
      url: 'https://kemenag.go.id',
    },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Situs Terkait</h1>
          <p className="text-sky-100">Kumpulan tautan ke situs parceiros dan aplikasi terkait</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8 flex gap-4 items-start">
          <Globe size={22} className="text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 mb-1">Portal Tautan Resmi</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Kumpulan tautan ke berbagai situs resmi dan aplikasi yang berkaitan dengan kegiatan
              penjaminan mutu di UIN Raden Fatah Palembang.
            </p>
          </div>
        </div>

        {/* Site Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sites.map((site, index) => (
            <SiteCard key={index} {...site} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
