export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

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
    ],
  },
  { label: 'SIAMI', href: 'http://siami.radenfatah.ac.id', external: true },
  {
    label: 'BKD Online',
    children: [
      { label: 'Login BKD', href: 'http://bkd.radenfatah.ac.id', external: true },
      { label: 'Pendaftaran BKD', href: 'http://uinrf.id/BKD-Online-DTNPNS', external: true },
    ],
  },
  { label: 'CDC', href: 'http://cdc.radenfatah.ac.id', external: true },
  { label: 'Galeri Foto', href: '/galeri-foto' },
  { label: 'Sertifikat', href: '/sertifikat' },
  { label: 'Peraturan', href: '/peraturan' },
];

export const contactInfo = {
  address: 'Jl. Pangeran Ratu, 5 Ulu, Jakabaring, Palembang, 30252',
  building: 'Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)',
  phone: '+62 895-2491-8613',
  email: 'lpm_uin@radenfatah.ac.id',
  whatsapp: '+62 895-2491-8613',
};
