export interface User {
  id: string;
  username: string;
  email: string;
  roleIds: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Kategori {
  id: string;
  nama: string;
  slug: string;
  jumlah?: number;
  createdAt: string;
}

export interface Faker {
  id: string;
  kode_faker: string;
  nama_faker: string;
  createdAt: string;
}

export interface Prodi {
  id: string;
  kode_prodi: string;
  nama_prodi: string;
  faker_id: string;
  createdAt: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  gambar?: string;
  excerpt: string;
  konten: string;
  status: 'draft' | 'published' | 'archived';
  metaTitle?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface Galeri {
  id: string;
  judul: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  createdAt: string;
}

export interface DownloadFile {
  id: string;
  judul: string;
  tipe: string;
  ukuran?: string;
  url: string;
  tanggal: string;
  createdAt: string;
}

export interface Staf {
  id: string;
  nama: string;
  jabatan: string;
  foto?: string;
  programStudi?: string;
  email?: string;
  urutan: number;
}

export interface Sertifikat {
  id: string;
  prodiId: string;
  jenjang: 'S1' | 'S2' | 'S3';
  mulaiAktif: string;
  akhirAktif: string;
  nilai: string;
  skor: string;
  fileSk?: string;
  createdAt: string;
}

export interface Akreditasi {
  id: string;
  judul: string;
  deskripsi: string;
  tipe: 'AMI Auditee' | 'AMI Auditor' | 'Evaluasi Diri' | 'Program Studi';
  file?: string;
  linkEksternal?: string;
  urutan: number;
  isActive: boolean;
  createdAt: string;
}

export interface IsoMilestone {
  id: string;
  tahun: string;
  judul: string;
  deskripsi: string;
  status: 'completed' | 'current' | 'upcoming';
  dokumen?: string;
  linkEksternal?: string;
  urutan: number;
  createdAt: string;
}

export interface SitusItem {
  id: string;
  nama: string;
  deskripsi: string;
  url: string;
  kategori: string;
  icon: string;
  urutan: number;
  createdAt: string;
}

export interface Gpmp {
  id: string;
  tentang: string;
  tugas: GpmpTugas[];
  panduan?: string;
  linkPanduan?: string;
  createdAt: string;
}

export interface GpmpTugas {
  id: string;
  icon: string;
  judul: string;
  deskripsi: string;
}

export interface Gpmf {
  id: string;
  tentang: string;
  tugas: GpmfTugas[];
  jadwal: GpmfJadwal[];
  panduan?: string;
  linkPanduan?: string;
  createdAt: string;
}

export interface GpmfTugas {
  id: string;
  icon: string;
  judul: string;
  deskripsi: string;
}

export interface GpmfJadwal {
  id: string;
  hari: string;
  kegiatan: string;
  waktu: string;
  lokasi: string;
}

export interface Sambutan {
  id: string;
  nama: string;
  jabatan: string;
  konten: string;
  foto?: string;
  createdAt: string;
}

export interface VisiMisiData {
  id: string;
  visi: string;
  misi: VisiMisiItem[];
  createdAt: string;
}

export interface VisiMisiItem {
  id: string;
  no: number;
  judul: string;
  deskripsi: string;
}

export interface StrukturProfil {
  id: string;
  deskripsi: string;
  gambar?: string;
  filePdf?: string;
  createdAt: string;
}

export interface KontakData {
  id: string;
  alamat: string;
  gedung: string;
  telepon: string;
  email: string;
  mapsUrl?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  nama: string;
  permissions: string[];
  createdAt: string;
}

export interface Permission {
  id: string;
  nama: string;
  aplikasi: string;
  modul: string;
  createdAt: string;
}

export interface Peraturan {
  id: string;
  kategori: string;
  nomor: string;
  judul: string;
  tahun?: string;
  url?: string;
  urutan: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  pertanyaan: string;
  options: PollOption[];
  isActive: boolean;
}

export interface Halaman {
  id: string;
  slug: string;
  judul: string;
  konten: string;
}

export interface Partner {
  id: string;
  nama: string;
  url: string;
}

export interface FooterData {
  alamat: string;
  gedung: string;
  telepon: string;
  email: string;
  partners: Partner[];
  socials: { facebook?: string; twitter?: string; instagram?: string; youtube?: string };
  copyright: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  detail?: string;
  timestamp: string;
}

export const ALL_PERMISSIONS = [
  'dashboard.read',
  'berita.create','berita.read','berita.update','berita.delete',
  'galeri.create','galeri.read','galeri.update','galeri.delete',
  'download.create','download.read','download.update','download.delete',
  'halaman.update',
  'staf.create','staf.read','staf.update','staf.delete',
  'sertifikat.create','sertifikat.read','sertifikat.update','sertifikat.delete',
  'peraturan.create','peraturan.read','peraturan.update','peraturan.delete',
  'poll.create','poll.read','poll.update','poll.delete',
  'faker.create','faker.read','faker.update','faker.delete',
  'prodi.create','prodi.read','prodi.update','prodi.delete',
  'footer.read','footer.update',
  'kategori.create','kategori.read','kategori.update','kategori.delete',
  'user.create','user.read','user.update','user.delete',
  'struktur.read','struktur.update',
  'spme.create','spme.read','spme.update','spme.delete',
  'profil.read','profil.update',
  'spmi.create','spmi.read','spmi.update','spmi.delete',
  'log.read',
  'settings.read','settings.update',
] as const;
