import type { NavItem, NewsArticle, GalleryItem, DownloadFile, PrayerTime, Partner, AccreditationData, Regulation } from '../types';

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil',
    children: [
      { label: 'Profil LPM', href: '/profil' },
      { label: 'Sambutan Ketua', href: '/sambutan-ketua' },
      { label: 'Visi dan Misi', href: '/visi-dan-misi' },
      { label: 'Struktur Organisasi', href: '/struktur-organisasi' },
      { label: 'Pimpinan dan Staf', href: '/pimpinan-dan-staf' },
      { label: 'Kontak', href: '/kontak' },
    ],
  },
  {
    label: 'SPME',
    children: [
      { label: 'Instrumen Akreditasi BAN-PT', href: '/spme/akreditasi-banpt' },
      { label: 'ISO', href: '/spme/iso' },
      { label: 'Situs Terkait', href: '/spme/situs-terkait' },
    ],
  },
  {
    label: 'SPMI',
    children: [
      { label: 'Gugus Pengendalian Mutu Prodi (GPMP)', href: '/spmi/gpmp' },
      { label: 'Gugus Penjaminan Mutu Fakultas (GPMF)', href: '/spmi/gpmf' },
      { label: 'SIAMI', href: 'http://siami.radenfatah.ac.id/', children: [] },
    ],
  },
  {
    label: 'BKD Online',
    children: [
      { label: 'Login BKD', href: 'http://bkd.radenfatah.ac.id' },
      { label: 'Pendaftaran BKD', href: 'http://uinrf.id/BKD-Online-DTNPNS' },
    ],
  },
  { label: 'CDC', href: 'http://cdc.radenfatah.ac.id' },
  { label: 'Galeri Foto', href: '/galeri-foto' },
  { label: 'Sertifikat', href: '/sertifikat' },
  { label: 'Peraturan', href: '/peraturan' },
];

export const newsArticles: NewsArticle[] = [
  {
    id: 541,
    title: 'LPM UIN Raden Fatah Gaungkan Pentingnya Mutu dan Akreditasi dalam Apel Pagi Rektorat',
    date: '13 April 2026',
    excerpt: 'Lembaga Penjaminan Mutu UIN Raden Fatah Palembang turut hadir dalam apel pagi rektorat untuk menekankan pentingnya penjaminan mutu di lingkungan kampus.',
  },
  {
    id: 540,
    title: 'Sinergi LPM dan Senat UIN Raden Fatah dalam Penyempurnaan Dokumen SPMI',
    date: '13 April 2026',
    excerpt: 'Tim LPM bekerja sama dengan Senat untuk menyempurnakan dokumen Sistem Penjaminan Mutu Internal (SPMI) UIN Raden Fatah Palembang.',
  },
  {
    id: 539,
    title: 'Dukung Transformasi Digital, Tim LPM UIN Raden Fatah Ikuti Pelatihan AI Gemini Academy',
    date: '11 Maret 2026',
    excerpt: 'Tim LPM UIN Raden Fatah mengikuti pelatihan AI Gemini Academy untuk mendukung transformasi digital di lingkungan universitas.',
  },
  {
    id: 538,
    title: 'Perkuat Profesionalisme Dosen, LPM UIN Raden Fatah Serahkan 104 Sertifikat Serdos PTKI',
    date: '11 Maret 2026',
    excerpt: 'LPM UIN Raden Fatah menyerahkan 104 sertifikat Sertifikasi Dosen (Serdos) kepada dosen di lingkungan UIN Raden Fatah Palembang.',
  },
  {
    id: 537,
    title: 'KULTURA Ramadhan 2026: LPM Ajak Sivitas Akademika Mengenal ISO 21001',
    date: '5 Maret 2026',
    excerpt: 'Dalam program KULTURA Ramadhan 2026, LPM mengajak sivitas akademika untuk mengenal standar ISO 21001.',
  },
  {
    id: 536,
    title: 'KULTURA Ramadhan 2026: Bahas Tindak Lanjut AMI dan Rapat Tinjauan Manajemen',
    date: '3 Maret 2026',
    excerpt: 'Program KULTURA Ramadhan 2026 juga membahas tindak lanjut Audit Mutu Internal (AMI) dan Rapat Tinjauan Manajemen.',
  },
];

export const galleryItems: GalleryItem[] = [
  { id: 1, caption: 'Selamat dan Sukses', image: '/gallery/slide1.jpg' },
  { id: 2, caption: 'Audit ISO 9001:2015', image: '/gallery/slide2.jpg' },
  { id: 3, caption: 'Audit Mutu Internal 2024', image: '/gallery/slide3.jpg' },
  { id: 4, caption: 'Monev GPMF', image: '/gallery/slide4.jpg' },
  { id: 5, caption: 'Workshop OBE', image: '/gallery/slide5.jpg' },
  { id: 6, caption: 'Refreshment Auditor AMI', image: '/gallery/slide6.jpg' },
  { id: 7, caption: 'Pelatihan Kurikulum', image: '/gallery/slide7.jpg' },
  { id: 8, caption: 'Forum Penjaminan Mutu', image: '/gallery/slide8.jpg' },
  { id: 9, caption: 'Rapat Roadmap Akreditasi', image: '/gallery/slide9.jpg' },
  { id: 10, caption: 'Finalisasi Laporan PKDP', image: '/gallery/slide10.jpg' },
  { id: 11, caption: 'Penguatan Budaya Mutu UPPS', image: '/gallery/slide11.jpg' },
  { id: 12, caption: 'Benchmarking LPM UINRF', image: '/gallery/slide12.jpg' },
  { id: 13, caption: 'Audit ISO Stage 2', image: '/gallery/slide13.jpg' },
  { id: 14, caption: 'Audit ISO Saintek', image: '/gallery/slide14.jpg' },
  { id: 15, caption: 'Audit Mutu Internal', image: '/gallery/slide15.jpg' },
];

export const downloadFiles: DownloadFile[] = [
  {
    id: 231,
    title: 'Link Penyerahan Instrumen yang Telah diisi Auditee',
    date: '22 Juli 2022',
    type: 'link',
  },
  {
    id: 228,
    title: 'Formulir AMI Auditor 2022',
    date: '21 Juli 2022',
    type: 'pdf',
    size: '256 KB',
  },
  {
    id: 227,
    title: 'Instrumen AMI Fakultas UPPS 2022',
    date: '22 Juli 2022',
    type: 'pdf',
    size: '1.2 MB',
  },
  {
    id: 226,
    title: 'Instrumen AMI KPA 2022',
    date: '22 Juli 2022',
    type: 'pdf',
    size: '890 KB',
  },
];

export const prayerTimes: PrayerTime[] = [
  { name: 'Imsak', time: '04:33', arabic: 'إِمْسَاك' },
  { name: 'Subuh', time: '04:43', arabic: 'صَبْح' },
  { name: 'Syuruq', time: '05:59', arabic: 'شُرُوق' },
  { name: 'Dzuhur', time: '12:03', arabic: 'ظُهْر' },
  { name: 'Ashar', time: '15:20', arabic: 'عَصر' },
  { name: 'Maghrib', time: '18:04', arabic: 'مَغْرِب' },
  { name: 'Isya', time: '19:13', arabic: 'عِشَاء' },
];

export const partners: Partner[] = [
  { id: 1, name: 'UIN Raden Fatah Palembang', url: 'http://www.radenfatah.ac.id' },
  { id: 2, name: 'ISO 9001:2015', url: '#' },
  { id: 3, name: 'Open Jurnal Sistem', url: 'http://jurnal.radenfatah.ac.id' },
  { id: 4, name: 'Aplikasi e-Kinerja', url: 'http://e-kinerja.radenfatah.ac.id' },
  { id: 5, name: 'e-Prints Repository', url: 'http://eprints.radenfatah.ac.id' },
  { id: 6, name: 'LPSE', url: 'http://lpse.radenfatah.ac.id' },
  { id: 7, name: 'Perpustakaan', url: 'http://perpustakaan.radenfatah.ac.id' },
  { id: 8, name: 'e-Learning', url: 'http://e-learning.radenfatah.ac.id' },
  { id: 9, name: 'Beasiswa Bidik Misi', url: '#' },
  { id: 10, name: 'Sialim', url: 'http://sialim.radenfatah.ac.id' },
  { id: 11, name: 'Email Berbasis Domain', url: '#' },
  { id: 12, name: 'Senayan SLiMS', url: '#' },
  { id: 13, name: 'Career Development Center', url: 'http://cdc.radenfatah.ac.id' },
];

export const accreditationData: AccreditationData[] = [
  { level: 'Akreditasi Unggul', count: 34, color: '#16a34a' },
  { level: 'Akreditasi A', count: 4, color: '#2563eb' },
  { level: 'Akreditasi B', count: 1, color: '#ca8a04' },
  { level: 'Akreditasi Baik Sekali', count: 7, color: '#7c3aed' },
];

export const regulations: Regulation[] = [
  {
    id: 1,
    category: 'Undang-Undang',
    number: 'No.02 Tahun 1989',
    title: 'Tentang Sistem Pendidikan Nasional',
  },
  {
    id: 2,
    category: 'Peraturan Pemerintah',
    number: 'PP No.19 Tahun 2005',
    title: 'Tentang Standar Nasional Pendidikan',
  },
  {
    id: 3,
    category: 'Peraturan Presiden',
    number: 'Perpres No.8 Tahun 2012',
    title: 'Tentang Kerangka Kualifikasi Nasional Indonesia',
  },
  {
    id: 4,
    category: 'Peraturan Menteri',
    number: 'Permen No.100 Tahun 2016',
    title: 'Tentang Pendirian, Perubahan, Pembubaran PTN, Dan Pendirian, Perubahan, Pencabutan Izin PTS',
  },
  {
    id: 5,
    category: 'Peraturan Menteri',
    number: 'Permen No.062 Tahun 2016',
    title: 'Tentang Sistem Penjaminan Mutu Pendidikan Tinggi',
  },
  {
    id: 6,
    category: 'Peraturan Menteri',
    number: 'Permen No.032 Tahun 2016',
    title: 'Tentang Akreditasi Program Studi Dan PT',
  },
  {
    id: 7,
    category: 'Peraturan Menteri',
    number: 'Permen No.044 Tahun 2015',
    title: 'Standar Nasional Pendidikan Tinggi',
  },
  {
    id: 8,
    category: 'Peraturan BAN-PT',
    number: 'PerBAN',
    title: 'Panduan Penyusunan Instrumen Akreditasi',
    url: 'https://banpt.or.id/perban',
  },
];

export const contactInfo = {
  address: 'Jl. Pangeran Ratu, 5 Ulu, Kec. Jakabaring Kota Palembang Sumatera Selatan, 30252',
  building: 'Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)',
  phone: '+62 895-2491-8613',
  email: 'lpm_uin@radenfatah.ac.id',
};

export const location = {
  coordinates: "2°59'LS, 104°47'BT",
  elevation: '10 m',
  kiblat: "65°27' (U-B)",
};

export const pollOptions = [
  { id: 1, label: 'Sangat Bagus' },
  { id: 2, label: 'Bagus' },
  { id: 3, label: 'Lumayan' },
  { id: 4, label: 'Tidak Bagus' },
];
