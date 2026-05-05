import type { User, Berita, Galeri, DownloadFile, Staf, Sertifikat, Peraturan, Poll, Halaman, FooterData, ActivityLog, Kategori, Faker, Prodi, Role, Permission, Akreditasi, IsoMilestone, SitusItem, Gpmp, Gpmf, Sambutan, VisiMisiData, KontakData, StrukturProfil } from './types';
import { ALL_PERMISSIONS } from './types';

const delay = () => new Promise(r => setTimeout(r, 50));
const uid = () => Math.random().toString(36).substring(2, 11);

// ============ KATEGORI BERITA ============
const DEFAULT_KATEGORI = [
  { id: 'k1', nama: 'Akreditasi', slug: 'akreditasi', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'k2', nama: 'SPMI', slug: 'spmi', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'k3', nama: 'Inovasi Digital', slug: 'inovasi-digital', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'k4', nama: 'Sertifikasi', slug: 'sertifikasi', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'k5', nama: 'ISO', slug: 'iso', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'k6', nama: 'Lainnya', slug: 'lainnya', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export async function getKategori(): Promise<Kategori[]> {
  await delay();
  const data = localStorage.getItem('lpm_kategori');
  if (!data) {
    localStorage.setItem('lpm_kategori', JSON.stringify(DEFAULT_KATEGORI));
    return DEFAULT_KATEGORI as Kategori[];
  }
  return JSON.parse(data);
}

export async function createKategori(data: Omit<Kategori, 'id' | 'created_at' | 'updated_at'>): Promise<Kategori> {
  await delay();
  const list = await getKategori();
  const now = new Date().toISOString();
  const newItem: Kategori = { ...data, id: uid(), created_at: now, updated_at: now };
  list.push(newItem);
  localStorage.setItem('lpm_kategori', JSON.stringify(list));
  return newItem;
}

export async function updateKategori(id: string, data: Partial<Kategori>): Promise<Kategori | undefined> {
  await delay();
  const list = await getKategori();
  const index = list.findIndex(k => k.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...data };
  localStorage.setItem('lpm_kategori', JSON.stringify(list));
  return list[index];
}

export async function deleteKategori(id: string): Promise<void> {
  await delay();
  const list = await getKategori();
  const filtered = list.filter(k => k.id !== id);
  localStorage.setItem('lpm_kategori', JSON.stringify(filtered));
}

// ============ USERS ============
const DEFAULT_USERS: User[] = [
  {
    id: 'u1', username: 'admin', email: 'admin@lpm.ac.id',
    roleIds: ['r1'], permissions: ALL_PERMISSIONS as unknown as string[], isActive: true,
    createdAt: '2024-01-01T00:00:00Z', lastLogin: new Date().toISOString()
  },
  {
    id: 'u3', username: 'viewer', email: 'viewer@lpm.ac.id',
    roleIds: ['r3'], permissions: ['dashboard.read','berita.read','galeri.read','download.read','staf.read','sertifikat.read','peraturan.read','spme.akreditasi.read','spme.iso.read','spme.situs.read','profil.read','spmi.read','log.read'], isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'u2', username: 'editor', email: 'editor@lpm.ac.id',
    roleIds: ['r2'], permissions: [
      'berita.create','berita.read','berita.update','berita.delete',
      'galeri.create','galeri.read','galeri.update','galeri.delete',
    ], isActive: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
];

export async function getUsers(): Promise<User[]> {
  await delay();
  const data = localStorage.getItem('lpm_users');
  if (!data) {
    localStorage.setItem('lpm_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(data).map((u: User) => ({ ...u, roleIds: u.roleIds || [] }));
}

export async function getUser(id: string): Promise<User | undefined> {
  const users = await getUsers();
  const u = users.find(u => u.id === id);
  if (u) u.roleIds = u.roleIds || [];
  return u;
}

export async function createUser(user: { username: string; email: string; roleIds: string[]; isActive: boolean; password?: string }): Promise<User> {
  await delay();
  const roles = await getRoles();
  const userRoles = roles.filter(r => (user.roleIds || []).includes(r.id));
  const computedPerms = [...new Set(userRoles.flatMap(r => r.permissions))];
  const users = await getUsers();
  const newUser: User = { ...user, roleIds: user.roleIds || [], permissions: computedPerms, id: uid(), createdAt: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem('lpm_users', JSON.stringify(users));
  return newUser;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
  await delay();
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  // Recompute permissions if roleIds changed
  if (data.roleIds) {
    const roles = await getRoles();
    const userRoles = roles.filter(r => data.roleIds!.includes(r.id));
    data.permissions = [...new Set(userRoles.flatMap(r => r.permissions))];
  }
  users[idx] = { ...users[idx], roleIds: (data.roleIds || users[idx].roleIds || []), ...data };
  localStorage.setItem('lpm_users', JSON.stringify(users));
  return users[idx];
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  const users = (await getUsers()).filter(u => u.id !== id);
  localStorage.setItem('lpm_users', JSON.stringify(users));
}

export async function loginUser(username: string, password: string): Promise<User> {
  await delay();
  const users = await getUsers();
  const user = users.find(u => u.username === username && u.isActive);
  if (!user) throw new Error('Username tidak ditemukan.');
  // Simple check: admin=admin123, editor=editor123
  const passMap: Record<string, string> = { admin: 'admin123', editor: 'editor123' };
  if (passMap[username] !== password) throw new Error('Password salah.');

  // Compute permissions from roles
  const roles = await getRoles();
  const userRoles = roles.filter(r => user.roleIds.includes(r.id));
  const computedPerms = [...new Set(userRoles.flatMap(r => r.permissions))];

  const updated = { ...user, roleIds: user.roleIds || [], permissions: computedPerms, lastLogin: new Date().toISOString() };
  const all = await getUsers();
  const idx = all.findIndex(u => u.id === user.id);
  all[idx] = { ...all[idx], permissions: computedPerms, lastLogin: updated.lastLogin };
  localStorage.setItem('lpm_users', JSON.stringify(all));
  return updated;
}

// ============ BERITA ============
const DEFAULT_BERITA: Berita[] = [
  { id: 'b1', kategoris_id: 1, author_id: 1, judul: 'LPM UIN Raden Fatah Gaungkan Pentingnya Mutu dan Akreditasi dalam Apel Pagi Rektorat', slug: 'lpm-gaungkan-pentingnya-mutu-dan-akreditasi', kategori: 'Akreditasi', tanggal: '2026-04-13', excerpt: 'Sosialisasi dan penguatan komitmen mutu terus digaungkan di lingkungan UIN Raden Fatah.', konten: '<p>Sosialisasi dan penguatan komitmen mutu...</p>', status: 'published', created_at: '2026-04-13T08:52:24Z', updated_at: '2026-04-13T08:52:24Z', author: 'admin' },
  { id: 'b2', kategoris_id: 2, author_id: 1, judul: 'Sinergi LPM dan Senat UIN Raden Fatah dalam Penyempurnaan Dokumen SPMI', slug: 'sinergi-lpm-dan-senat-penyempurnaan-sppi', kategori: 'SPMI', tanggal: '2026-04-13', excerpt: 'Langkah strategis diambil melalui rapat sinergi antara LPM dan Senat.', konten: '<p>Rapat sinergi...</p>', status: 'published', created_at: '2026-04-13T08:38:22Z', updated_at: '2026-04-13T08:38:22Z', author: 'admin' },
  { id: 'b3', kategoris_id: 3, author_id: 2, judul: 'Dukung Transformasi Digital, Tim LPM UIN Raden Fatah Ikuti Pelatihan AI Gemini Academy', slug: 'transformasi-digital-gemini-academy', kategori: 'Inovasi Digital', tanggal: '2026-03-11', excerpt: 'Adopsi teknologi kecerdasan buatan.', konten: '<p>Pelatihan AI...</p>', status: 'published', created_at: '2026-03-11T13:37:41Z', updated_at: '2026-03-11T13:37:41Z', author: 'editor' },
  { id: 'b4', kategoris_id: 4, author_id: 1, judul: 'Perkuat Profesionalisme Dosen, LPM Serahkan 104 Sertifikat Serdos PTKI', slug: 'serahkan-104-sertifikat-sertos', kategori: 'Sertifikasi', tanggal: '2026-03-11', excerpt: '104 dosen terima sertifikat pendidik.', konten: '<p>104 dosen...</p>', status: 'published', created_at: '2026-03-11T11:17:19Z', updated_at: '2026-03-11T11:17:19Z', author: 'admin' },
  { id: 'b5', kategoris_id: 5, author_id: 1, judul: 'KULTURA Ramadhan 2026: LPM Ajak Sivitas Akademika Mengenal ISO 21001', slug: 'kultura-ramadhan-2026-iso-21001', kategori: 'ISO', tanggal: '2026-03-05', excerpt: 'KULTURA Ramadhan 2026.', konten: '<p>KULTURA...</p>', status: 'published', created_at: '2026-03-05T09:29:05Z', updated_at: '2026-03-05T09:29:05Z', author: 'admin' },
  { id: 'b6', kategoris_id: 2, author_id: 2, judul: 'KULTURA Ramadhan 2026: Bahas Tindak Lanjut AMI dan Rapat Tinjauan Manajemen', slug: 'kultura-ramadhan-2026-tindak-lanjut-ami', kategori: 'SPMI', tanggal: '2026-03-03', excerpt: 'Tindak lanjut AMI.', konten: '<p>AMI...</p>', status: 'draft', created_at: '2026-03-03T12:32:30Z', updated_at: '2026-03-03T12:32:30Z', author: 'editor' },
];

export async function getBerita(): Promise<Berita[]> {
  await delay();
  const data = localStorage.getItem('lpm_berita');
  if (!data) { localStorage.setItem('lpm_berita', JSON.stringify(DEFAULT_BERITA)); return DEFAULT_BERITA; }
  return JSON.parse(data);
}

export async function createBerita(b: Omit<Berita, 'id' | 'created_at' | 'updated_at'>): Promise<Berita> {
  await delay();
  const list = await getBerita();
  const now = new Date().toISOString();
  const item: Berita = { ...b, id: uid(), created_at: now, updated_at: now };
  list.unshift(item);
  localStorage.setItem('lpm_berita', JSON.stringify(list));
  return item;
}

export async function updateBerita(id: string, data: Partial<Berita>): Promise<Berita | undefined> {
  await delay();
  const list = await getBerita();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updated_at: new Date().toISOString() };
  localStorage.setItem('lpm_berita', JSON.stringify(list));
  return list[idx];
}

export async function deleteBerita(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_berita', JSON.stringify((await getBerita()).filter(x => x.id !== id)));
}

// ============ GALERI ============
const DEFAULT_GALERI: Galeri[] = [
  { id: 'g1', judul: 'Audit ISO 9001:2015', gambar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400', kategori: 'Audit', tanggal: '2026-01-15', createdAt: '2026-01-15T00:00:00Z' },
  { id: 'g2', judul: 'Workshop OBE', gambar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', kategori: 'Workshop', tanggal: '2026-02-10', createdAt: '2026-02-10T00:00:00Z' },
  { id: 'g3', judul: 'Audit Mutu Internal 2024', gambar: 'https://images.unsplash.com/photo-1577415124269-311110d1078c?w=400', kategori: 'Audit', tanggal: '2026-02-20', createdAt: '2026-02-20T00:00:00Z' },
  { id: 'g4', judul: 'Pelatihan Kurikulum', gambar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', kategori: 'Pelatihan', tanggal: '2026-03-05', createdAt: '2026-03-05T00:00:00Z' },
  { id: 'g5', judul: 'Forum Penjaminan Mutu', gambar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', kategori: 'Lainnya', tanggal: '2026-03-15', createdAt: '2026-03-15T00:00:00Z' },
  { id: 'g6', judul: 'Benchmarking LPM UINRF', gambar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', kategori: 'Lainnya', tanggal: '2026-03-20', createdAt: '2026-03-20T00:00:00Z' },
];

export async function getGaleri(): Promise<Galeri[]> {
  await delay();
  const data = localStorage.getItem('lpm_galeri');
  if (!data) { localStorage.setItem('lpm_galeri', JSON.stringify(DEFAULT_GALERI)); return DEFAULT_GALERI; }
  return JSON.parse(data);
}

export async function createGaleri(g: Omit<Galeri, 'id' | 'createdAt'>): Promise<Galeri> {
  await delay();
  const list = await getGaleri();
  const item: Galeri = { ...g, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  localStorage.setItem('lpm_galeri', JSON.stringify(list));
  return item;
}

export async function updateGaleri(id: string, data: Partial<Galeri>): Promise<Galeri | undefined> {
  await delay();
  const list = await getGaleri();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_galeri', JSON.stringify(list));
  return list[idx];
}

export async function deleteGaleri(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_galeri', JSON.stringify((await getGaleri()).filter(x => x.id !== id)));
}

// ============ DOWNLOADS ============
const DEFAULT_DOWNLOADS: DownloadFile[] = [
  { id: 'd1', judul: 'Link Penyerahan Instrumen yang Telah diisi Auditee', tipe: 'link', tanggal: '2022-07-22', url: '#', createdAt: '2022-07-22T00:00:00Z' },
  { id: 'd2', judul: 'Formulir AMI Auditor 2022', tipe: 'pdf', ukuran: '256 KB', tanggal: '2022-07-21', url: '#', createdAt: '2022-07-21T00:00:00Z' },
  { id: 'd3', judul: 'Instrumen AMI Fakultas UPPS 2022', tipe: 'pdf', ukuran: '1.2 MB', tanggal: '2022-07-22', url: '#', createdAt: '2022-07-22T00:00:00Z' },
  { id: 'd4', judul: 'Instrumen AMI KPA 2022', tipe: 'pdf', ukuran: '890 KB', tanggal: '2022-07-22', url: '#', createdAt: '2022-07-22T00:00:00Z' },
];

export async function getDownloads(): Promise<DownloadFile[]> {
  await delay();
  const data = localStorage.getItem('lpm_downloads');
  if (!data) { localStorage.setItem('lpm_downloads', JSON.stringify(DEFAULT_DOWNLOADS)); return DEFAULT_DOWNLOADS; }
  return JSON.parse(data);
}

export async function createDownload(d: Omit<DownloadFile, 'id' | 'createdAt'>): Promise<DownloadFile> {
  await delay();
  const list = await getDownloads();
  const item: DownloadFile = { ...d, id: uid(), createdAt: new Date().toISOString() };
  list.unshift(item);
  localStorage.setItem('lpm_downloads', JSON.stringify(list));
  return item;
}

export async function updateDownload(id: string, data: Partial<DownloadFile>): Promise<DownloadFile | undefined> {
  await delay();
  const list = await getDownloads();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_downloads', JSON.stringify(list));
  return list[idx];
}

export async function deleteDownload(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_downloads', JSON.stringify((await getDownloads()).filter(x => x.id !== id)));
}

// ============ STAF ============
const DEFAULT_STAF: Staf[] = [
  { id: 's1', nama: 'Dr. H. Nama pimpinan, M.Ag.', jabatan: 'Ketua LPM', foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop', programStudi: '-', email: 'ketua@lpm.ac.id', urutan: 1 },
  { id: 's2', nama: 'Dr. Jane Doe, M.Hum.', jabatan: 'Sekretaris', foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop', programStudi: '-', email: 'sekretaris@lpm.ac.id', urutan: 2 },
  { id: 's3', nama: 'Drs. John Doe, M.Si.', jabatan: 'Kepala Bagian Akreditasi', foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', programStudi: '-', email: 'akreditasi@lpm.ac.id', urutan: 3 },
  { id: 's4', nama: 'Dr. Sarah Connor, M.Kom.', jabatan: 'Kepala Bagian Mutu Internal', foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', programStudi: '-', email: 'mutu@lpm.ac.id', urutan: 4 },
  { id: 's5', nama: 'Ahmad Fauzi, S.Kom.', jabatan: 'Staf Administrasi', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', programStudi: '-', email: 'admin@lpm.ac.id', urutan: 5 },
  { id: 's6', nama: 'Siti Aminah, S.Pd., M.Pd.', jabatan: 'Staf Keuangan', foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', programStudi: '-', email: 'keuangan@lpm.ac.id', urutan: 6 },
];

export async function getStaf(): Promise<Staf[]> {
  await delay();
  const data = localStorage.getItem('lpm_staf');
  if (!data) { localStorage.setItem('lpm_staf', JSON.stringify(DEFAULT_STAF)); return DEFAULT_STAF; }
  return JSON.parse(data);
}

export async function createStaf(s: Omit<Staf, 'id'>): Promise<Staf> {
  await delay();
  const list = await getStaf();
  const item: Staf = { ...s, id: uid() };
  list.push(item);
  localStorage.setItem('lpm_staf', JSON.stringify(list));
  return item;
}

export async function updateStaf(id: string, data: Partial<Staf>): Promise<Staf | undefined> {
  await delay();
  const list = await getStaf();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_staf', JSON.stringify(list));
  return list[idx];
}

export async function deleteStaf(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_staf', JSON.stringify((await getStaf()).filter(x => x.id !== id)));
}

// ============ SERTIFIKAT ============
const DEFAULT_SERTIFIKAT: Sertifikat[] = [
  { id: 'k1', prodiId: 'p1', jenjang: 'S1', mulaiAktif: '2024-05-07', akhirAktif: '2029-05-07', nilai: '351', skor: 'Unggul', createdAt: '2024-05-07T00:00:00Z' },
  { id: 'k2', prodiId: 'p2', jenjang: 'S1', mulaiAktif: '2023-07-11', akhirAktif: '2028-07-11', nilai: '312', skor: 'A', createdAt: '2023-07-11T00:00:00Z' },
  { id: 'k3', prodiId: 'p5', jenjang: 'S1', mulaiAktif: '2024-04-03', akhirAktif: '2029-04-03', nilai: '388', skor: 'Unggul', createdAt: '2024-04-03T00:00:00Z' },
];

export async function getSertifikat(): Promise<Sertifikat[]> {
  await delay();
  const data = localStorage.getItem('lpm_sertifikat');
  if (!data) { localStorage.setItem('lpm_sertifikat', JSON.stringify(DEFAULT_SERTIFIKAT)); return DEFAULT_SERTIFIKAT; }
  return JSON.parse(data);
}

export async function createSertifikat(s: Omit<Sertifikat, 'id' | 'createdAt'>): Promise<Sertifikat> {
  await delay();
  const list = await getSertifikat();
  const item: Sertifikat = { ...s, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_sertifikat', JSON.stringify(list));
  return item;
}

export async function updateSertifikat(id: string, data: Partial<Sertifikat>): Promise<Sertifikat | undefined> {
  await delay();
  const list = await getSertifikat();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_sertifikat', JSON.stringify(list));
  return list[idx];
}

export async function deleteSertifikat(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_sertifikat', JSON.stringify((await getSertifikat()).filter(x => x.id !== id)));
}

// ============ PERATURAN ============
const DEFAULT_PERATURAN: Peraturan[] = [
  { id: 'p1', kategori: 'Undang-Undang', nomor: 'UU No.02/1989', judul: 'Tentang Sistem Pendidikan Nasional', tahun: '1989', url: '#', urutan: 1 },
  { id: 'p2', kategori: 'Peraturan Pemerintah', nomor: 'PP No.19/2005', judul: 'Tentang Standar Nasional Pendidikan', tahun: '2005', url: '#', urutan: 2 },
  { id: 'p3', kategori: 'Peraturan Presiden', nomor: 'Perpres No.8/2012', judul: 'Tentang Kerangka Kualifikasi Nasional Indonesia', tahun: '2012', url: '#', urutan: 3 },
  { id: 'p4', kategori: 'Peraturan Menteri', nomor: 'Permen No.100/2016', judul: 'Tentang Pendirian, Perubahan PTN', tahun: '2016', url: '#', urutan: 4 },
  { id: 'p5', kategori: 'Peraturan Menteri', nomor: 'Permen No.062/2016', judul: 'Tentang Sistem Penjaminan Mutu Pendidikan Tinggi', tahun: '2016', url: '#', urutan: 5 },
  { id: 'p6', kategori: 'Peraturan BAN-PT', nomor: 'PerBAN', judul: 'Panduan Penyusunan Instrumen Akreditasi', tahun: '2023', url: 'https://banpt.or.id', urutan: 6 },
];

export async function getPeraturan(): Promise<Peraturan[]> {
  await delay();
  const data = localStorage.getItem('lpm_peraturan');
  if (!data) { localStorage.setItem('lpm_peraturan', JSON.stringify(DEFAULT_PERATURAN)); return DEFAULT_PERATURAN; }
  return JSON.parse(data);
}

export async function createPeraturan(p: Omit<Peraturan, 'id'>): Promise<Peraturan> {
  await delay();
  const list = await getPeraturan();
  const item: Peraturan = { ...p, id: uid() };
  list.push(item);
  localStorage.setItem('lpm_peraturan', JSON.stringify(list));
  return item;
}

export async function updatePeraturan(id: string, data: Partial<Peraturan>): Promise<Peraturan | undefined> {
  await delay();
  const list = await getPeraturan();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_peraturan', JSON.stringify(list));
  return list[idx];
}

export async function deletePeraturan(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_peraturan', JSON.stringify((await getPeraturan()).filter(x => x.id !== id)));
}

// ============ POLL ============
const DEFAULT_POLL = {
  id: 'poll1',
  pertanyaan: 'Bagaimana Pendapat Anda tentang Website LPM UIN Raden Fatah ini?',
  options: [
    { id: 'o1', label: 'Sangat Bagus & Membantu', votes: 45 },
    { id: 'o2', label: 'Cukup Bagus', votes: 23 },
    { id: 'o3', label: 'Biasa Saja', votes: 8 },
    { id: 'o4', label: 'Perlu Perbaikan', votes: 3 },
  ],
  isActive: true,
};

export async function getPoll(): Promise<Poll> {
  await delay();
  const data = localStorage.getItem('lpm_poll');
  if (!data) { localStorage.setItem('lpm_poll', JSON.stringify(DEFAULT_POLL)); return DEFAULT_POLL as Poll; }
  return JSON.parse(data);
}

export async function updatePoll(data: Partial<Poll>): Promise<Poll> {
  await delay();
  const current = await getPoll();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_poll', JSON.stringify(updated));
  return updated;
}

// ============ HALAMAN ============
const DEFAULT_HALAMAN: Halaman[] = [
  { id: 'h1', slug: 'profil', judul: 'Profil LPM', konten: '<p>Konten Profil LPM...</p>' },
  { id: 'h2', slug: 'sambutan', judul: 'Sambutan Ketua', konten: '<p>Sambutan Ketua LPM...</p>' },
  { id: 'h3', slug: 'visimisi', judul: 'Visi dan Misi', konten: '<p>Visi Misi LPM...</p>' },
  { id: 'h4', slug: 'struktur', judul: 'Struktur Organisasi', konten: '<p>Struktur Organisasi LPM...</p>' },
];

export async function getHalaman(): Promise<Halaman[]> {
  await delay();
  const data = localStorage.getItem('lpm_halaman');
  if (!data) { localStorage.setItem('lpm_halaman', JSON.stringify(DEFAULT_HALAMAN)); return DEFAULT_HALAMAN; }
  return JSON.parse(data);
}

export async function getHalamanBySlug(slug: string): Promise<Halaman | undefined> {
  const list = await getHalaman();
  return list.find(h => h.slug === slug);
}

export async function updateHalaman(slug: string, data: Partial<Halaman>): Promise<Halaman | undefined> {
  await delay();
  const list = await getHalaman();
  const idx = list.findIndex(x => x.slug === slug);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_halaman', JSON.stringify(list));
  return list[idx];
}

// ============ FOOTER ============
const DEFAULT_FOOTER: FooterData = {
  alamat: 'Jl. Pangeran Ratu, 5 Ulu, Kec. Jakabaring Kota Palembang Sumatera Selatan, 30252',
  gedung: 'Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)',
  telepon: '+62 895-2491-8613',
  email: 'lpm_uin@radenfatah.ac.id',
  partners: [
    { id: 'pr1', nama: 'UIN Raden Fatah', url: 'http://www.radenfatah.ac.id' },
    { id: 'pr2', nama: 'SIAMI', url: 'http://siami.radenfatah.ac.id' },
    { id: 'pr3', nama: 'BKD Online', url: 'http://bkd.radenfatah.ac.id' },
    { id: 'pr4', nama: 'CDC', url: 'http://cdc.radenfatah.ac.id' },
  ],
  socials: { facebook: '#', instagram: '#', twitter: '#', youtube: '#' },
  copyright: 'Copyright PUSTIPD © 2018-2026',
};

export async function getFooter(): Promise<FooterData> {
  await delay();
  const data = localStorage.getItem('lpm_footer');
  if (!data) { localStorage.setItem('lpm_footer', JSON.stringify(DEFAULT_FOOTER)); return DEFAULT_FOOTER; }
  return JSON.parse(data);
}

export async function updateFooter(data: Partial<FooterData>): Promise<FooterData> {
  await delay();
  const current = await getFooter();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_footer', JSON.stringify(updated));
  return updated;
}

// ============ LOGS ============
export async function getLogs(): Promise<ActivityLog[]> {
  await delay();
  const data = localStorage.getItem('lpm_logs');
  if (!data) return [];
  return JSON.parse(data);
}

export async function addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
  await delay();
  const logs = await getLogs();
  const item: ActivityLog = { ...log, id: uid(), timestamp: new Date().toISOString() };
  logs.unshift(item);
  // keep last 100 logs
  localStorage.setItem('lpm_logs', JSON.stringify(logs.slice(0, 100)));
  return item;
}

export async function clearLogs(): Promise<void> {
  await delay();
  localStorage.setItem('lpm_logs', JSON.stringify([]));
}

// ============ FAKULTAS ============
const DEFAULT_FAKER: Faker[] = [
  { id: 'f1', kode_faker: 'FT', nama_faker: 'Fakultas Tarbiyah dan Keguruan', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'f2', kode_faker: 'FU', nama_faker: 'Fakultas Ushuluddin dan Studi Islam', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'f3', kode_faker: 'FK', nama_faker: 'Fakultas Syari\'ah', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'f4', kode_faker: 'FE', nama_faker: 'Fakultas Ekonomi dan Bisnis Islam', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'f5', kode_faker: 'FP', nama_faker: 'Fakultas Pascasarjana', createdAt: '2024-01-01T00:00:00Z' },
];

export async function getFaker(): Promise<Faker[]> {
  await delay();
  const data = localStorage.getItem('lpm_faker');
  if (!data) {
    localStorage.setItem('lpm_faker', JSON.stringify(DEFAULT_FAKER));
    return DEFAULT_FAKER;
  }
  return JSON.parse(data);
}

export async function createFaker(data: Omit<Faker, 'id' | 'createdAt'>): Promise<Faker> {
  await delay();
  const list = await getFaker();
  const newItem: Faker = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(newItem);
  localStorage.setItem('lpm_faker', JSON.stringify(list));
  return newItem;
}

export async function updateFaker(id: string, data: Partial<Faker>): Promise<Faker | undefined> {
  await delay();
  const list = await getFaker();
  const idx = list.findIndex(f => f.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_faker', JSON.stringify(list));
  return list[idx];
}

export async function deleteFaker(id: string): Promise<void> {
  await delay();
  const list = await getFaker().then(ls => ls.filter(f => f.id !== id));
  localStorage.setItem('lpm_faker', JSON.stringify(list));
}

// ============ PROGRAM STUDI ============
const DEFAULT_PRODI: Prodi[] = [
  { id: 'p1', kode_prodi: 'PAI', nama_prodi: 'Pendidikan Agama Islam', faker_id: 'f1', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p2', kode_prodi: 'PIAI', nama_prodi: 'Pendidikan Islam Anak Usia Dini', faker_id: 'f1', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p3', kode_prodi: 'TQ', nama_prodi: 'Tafsir Hadits', faker_id: 'f2', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p4', kode_prodi: 'HES', nama_prodi: 'Hukum Ekonomi Syariah', faker_id: 'f3', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'p5', kode_prodi: 'PEBSI', nama_prodi: 'Perbankan Syariah', faker_id: 'f4', createdAt: '2024-01-01T00:00:00Z' },
];

export async function getProdi(): Promise<Prodi[]> {
  await delay();
  const data = localStorage.getItem('lpm_prodi');
  if (!data) {
    localStorage.setItem('lpm_prodi', JSON.stringify(DEFAULT_PRODI));
    return DEFAULT_PRODI;
  }
  return JSON.parse(data);
}

export async function createProdi(data: Omit<Prodi, 'id' | 'createdAt'>): Promise<Prodi> {
  await delay();
  const list = await getProdi();
  const newItem: Prodi = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(newItem);
  localStorage.setItem('lpm_prodi', JSON.stringify(list));
  return newItem;
}

export async function updateProdi(id: string, data: Partial<Prodi>): Promise<Prodi | undefined> {
  await delay();
  const list = await getProdi();
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_prodi', JSON.stringify(list));
  return list[idx];
}

export async function deleteProdi(id: string): Promise<void> {
  await delay();
  const list = await getProdi().then(ls => ls.filter(p => p.id !== id));
  localStorage.setItem('lpm_prodi', JSON.stringify(list));
}

// ============ ROLE ============
const DEFAULT_ROLES: Role[] = [
  { id: 'r1', nama: 'Super Admin', permissions: ALL_PERMISSIONS as unknown as string[], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r2', nama: 'Editor', permissions: ['berita.create', 'berita.read', 'berita.update', 'berita.delete', 'galeri.create', 'galeri.read', 'galeri.update', 'galeri.delete'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'r3', nama: 'Viewer', permissions: ['berita.read', 'galeri.read'], createdAt: '2024-01-01T00:00:00Z' },
];

export async function getRoles(): Promise<Role[]> {
  await delay();
  const data = localStorage.getItem('lpm_roles');
  if (!data) { localStorage.setItem('lpm_roles', JSON.stringify(DEFAULT_ROLES)); return DEFAULT_ROLES; }
  return JSON.parse(data);
}

export async function createRole(data: Omit<Role, 'id' | 'createdAt'>): Promise<Role> {
  await delay();
  const list = await getRoles();
  const item: Role = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_roles', JSON.stringify(list));
  return item;
}

export async function updateRole(id: string, data: Partial<Role>): Promise<Role | undefined> {
  await delay();
  const list = await getRoles();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_roles', JSON.stringify(list));
  return list[idx];
}

export async function deleteRole(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_roles', JSON.stringify((await getRoles()).filter(r => r.id !== id)));
}

// ============ PERMISSION ============
const DEFAULT_PERMISSIONS: Permission[] = [
  // Berita
  { id: 'berita.create', nama: 'Buat Berita', aplikasi: 'LPM Website', modul: 'Berita', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'berita.read', nama: 'Lihat Berita', aplikasi: 'LPM Website', modul: 'Berita', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'berita.update', nama: 'Edit Berita', aplikasi: 'LPM Website', modul: 'Berita', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'berita.delete', nama: 'Hapus Berita', aplikasi: 'LPM Website', modul: 'Berita', createdAt: '2024-01-01T00:00:00Z' },
  // Galeri
  { id: 'galeri.create', nama: 'Buat Galeri', aplikasi: 'LPM Website', modul: 'Galeri', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galeri.read', nama: 'Lihat Galeri', aplikasi: 'LPM Website', modul: 'Galeri', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galeri.update', nama: 'Edit Galeri', aplikasi: 'LPM Website', modul: 'Galeri', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galeri.delete', nama: 'Hapus Galeri', aplikasi: 'LPM Website', modul: 'Galeri', createdAt: '2024-01-01T00:00:00Z' },
  // Download
  { id: 'download.create', nama: 'Buat Download', aplikasi: 'LPM Website', modul: 'Download', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'download.read', nama: 'Lihat Download', aplikasi: 'LPM Website', modul: 'Download', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'download.update', nama: 'Edit Download', aplikasi: 'LPM Website', modul: 'Download', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'download.delete', nama: 'Hapus Download', aplikasi: 'LPM Website', modul: 'Download', createdAt: '2024-01-01T00:00:00Z' },
  // Halaman
  { id: 'halaman.read', nama: 'Lihat Halaman', aplikasi: 'LPM Website', modul: 'Halaman', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'halaman.update', nama: 'Edit Halaman', aplikasi: 'LPM Website', modul: 'Halaman', createdAt: '2024-01-01T00:00:00Z' },
  // Staf
  { id: 'staf.create', nama: 'Buat Staf', aplikasi: 'LPM Website', modul: 'Staf', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'staf.read', nama: 'Lihat Staf', aplikasi: 'LPM Website', modul: 'Staf', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'staf.update', nama: 'Edit Staf', aplikasi: 'LPM Website', modul: 'Staf', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'staf.delete', nama: 'Hapus Staf', aplikasi: 'LPM Website', modul: 'Staf', createdAt: '2024-01-01T00:00:00Z' },
  // Sertifikat
  { id: 'sertifikat.create', nama: 'Buat Sertifikat', aplikasi: 'LPM Website', modul: 'Sertifikat', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sertifikat.read', nama: 'Lihat Sertifikat', aplikasi: 'LPM Website', modul: 'Sertifikat', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sertifikat.update', nama: 'Edit Sertifikat', aplikasi: 'LPM Website', modul: 'Sertifikat', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sertifikat.delete', nama: 'Hapus Sertifikat', aplikasi: 'LPM Website', modul: 'Sertifikat', createdAt: '2024-01-01T00:00:00Z' },
  // Peraturan
  { id: 'peraturan.create', nama: 'Buat Peraturan', aplikasi: 'LPM Website', modul: 'Peraturan', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'peraturan.read', nama: 'Lihat Peraturan', aplikasi: 'LPM Website', modul: 'Peraturan', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'peraturan.update', nama: 'Edit Peraturan', aplikasi: 'LPM Website', modul: 'Peraturan', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'peraturan.delete', nama: 'Hapus Peraturan', aplikasi: 'LPM Website', modul: 'Peraturan', createdAt: '2024-01-01T00:00:00Z' },
  // Poll
  { id: 'poll.create', nama: 'Buat Poll', aplikasi: 'LPM Website', modul: 'Poll', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'poll.read', nama: 'Lihat Poll', aplikasi: 'LPM Website', modul: 'Poll', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'poll.update', nama: 'Edit Poll', aplikasi: 'LPM Website', modul: 'Poll', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'poll.delete', nama: 'Hapus Poll', aplikasi: 'LPM Website', modul: 'Poll', createdAt: '2024-01-01T00:00:00Z' },
  // Footer
  { id: 'footer.read', nama: 'Lihat Footer', aplikasi: 'LPM Website', modul: 'Footer', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'footer.update', nama: 'Edit Footer', aplikasi: 'LPM Website', modul: 'Footer', createdAt: '2024-01-01T00:00:00Z' },
  // User
  { id: 'user.create', nama: 'Buat User', aplikasi: 'LPM Website', modul: 'User', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'user.read', nama: 'Lihat User', aplikasi: 'LPM Website', modul: 'User', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'user.update', nama: 'Edit User', aplikasi: 'LPM Website', modul: 'User', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'user.delete', nama: 'Hapus User', aplikasi: 'LPM Website', modul: 'User', createdAt: '2024-01-01T00:00:00Z' },
  // Role
  { id: 'role.create', nama: 'Buat Role', aplikasi: 'LPM Website', modul: 'Role', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'role.read', nama: 'Lihat Role', aplikasi: 'LPM Website', modul: 'Role', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'role.update', nama: 'Edit Role', aplikasi: 'LPM Website', modul: 'Role', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'role.delete', nama: 'Hapus Role', aplikasi: 'LPM Website', modul: 'Role', createdAt: '2024-01-01T00:00:00Z' },
  // Log
  { id: 'log.read', nama: 'Lihat Log Aktivitas', aplikasi: 'LPM Website', modul: 'Log Aktivitas', createdAt: '2024-01-01T00:00:00Z' },
  // Faker
  { id: 'faker.create', nama: 'Buat Faker', aplikasi: 'LPM Website', modul: 'Faker', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'faker.read', nama: 'Lihat Faker', aplikasi: 'LPM Website', modul: 'Faker', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'faker.update', nama: 'Edit Faker', aplikasi: 'LPM Website', modul: 'Faker', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'faker.delete', nama: 'Hapus Faker', aplikasi: 'LPM Website', modul: 'Faker', createdAt: '2024-01-01T00:00:00Z' },
  // Kategori
  { id: 'kategori.create', nama: 'Buat Kategori', aplikasi: 'LPM Website', modul: 'Kategori', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'kategori.read', nama: 'Lihat Kategori', aplikasi: 'LPM Website', modul: 'Kategori', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'kategori.update', nama: 'Edit Kategori', aplikasi: 'LPM Website', modul: 'Kategori', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'kategori.delete', nama: 'Hapus Kategori', aplikasi: 'LPM Website', modul: 'Kategori', createdAt: '2024-01-01T00:00:00Z' },
  // Prodi
  { id: 'prodi.create', nama: 'Buat Prodi', aplikasi: 'LPM Website', modul: 'Program Studi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'prodi.read', nama: 'Lihat Prodi', aplikasi: 'LPM Website', modul: 'Program Studi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'prodi.update', nama: 'Edit Prodi', aplikasi: 'LPM Website', modul: 'Program Studi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'prodi.delete', nama: 'Hapus Prodi', aplikasi: 'LPM Website', modul: 'Program Studi', createdAt: '2024-01-01T00:00:00Z' },
  // SPMI Akreditasi
  { id: 'spme.akreditasi.create', nama: 'Buat SPMI Akreditasi', aplikasi: 'LPM Website', modul: 'SPMI Akreditasi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.akreditasi.read', nama: 'Lihat SPMI Akreditasi', aplikasi: 'LPM Website', modul: 'SPMI Akreditasi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.akreditasi.update', nama: 'Edit SPMI Akreditasi', aplikasi: 'LPM Website', modul: 'SPMI Akreditasi', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.akreditasi.delete', nama: 'Hapus SPMI Akreditasi', aplikasi: 'LPM Website', modul: 'SPMI Akreditasi', createdAt: '2024-01-01T00:00:00Z' },
  // SPMI ISO
  { id: 'spme.iso.create', nama: 'Buat SPMI ISO', aplikasi: 'LPM Website', modul: 'SPMI ISO', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.iso.read', nama: 'Lihat SPMI ISO', aplikasi: 'LPM Website', modul: 'SPMI ISO', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.iso.update', nama: 'Edit SPMI ISO', aplikasi: 'LPM Website', modul: 'SPMI ISO', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.iso.delete', nama: 'Hapus SPMI ISO', aplikasi: 'LPM Website', modul: 'SPMI ISO', createdAt: '2024-01-01T00:00:00Z' },
  // SPMI Situs
  { id: 'spme.situs.create', nama: 'Buat SPMI Situs', aplikasi: 'LPM Website', modul: 'SPMI Situs', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.situs.read', nama: 'Lihat SPMI Situs', aplikasi: 'LPM Website', modul: 'SPMI Situs', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.situs.update', nama: 'Edit SPMI Situs', aplikasi: 'LPM Website', modul: 'SPMI Situs', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spme.situs.delete', nama: 'Hapus SPMI Situs', aplikasi: 'LPM Website', modul: 'SPMI Situs', createdAt: '2024-01-01T00:00:00Z' },
  // Profil
  { id: 'profil.read', nama: 'Lihat Profil', aplikasi: 'LPM Website', modul: 'Profil', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'profil.update', nama: 'Edit Profil', aplikasi: 'LPM Website', modul: 'Profil', createdAt: '2024-01-01T00:00:00Z' },
  // SPMI
  { id: 'spmi.create', nama: 'Buat SPMI', aplikasi: 'LPM Website', modul: 'SPMI', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spmi.read', nama: 'Lihat SPMI', aplikasi: 'LPM Website', modul: 'SPMI', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spmi.update', nama: 'Edit SPMI', aplikasi: 'LPM Website', modul: 'SPMI', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'spmi.delete', nama: 'Hapus SPMI', aplikasi: 'LPM Website', modul: 'SPMI', createdAt: '2024-01-01T00:00:00Z' },
  // Settings
  { id: 'settings.read', nama: 'Lihat Pengaturan', aplikasi: 'LPM Website', modul: 'Pengaturan', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'settings.update', nama: 'Edit Pengaturan', aplikasi: 'LPM Website', modul: 'Pengaturan', createdAt: '2024-01-01T00:00:00Z' },
  // Struktur
  { id: 'struktur.read', nama: 'Lihat Struktur', aplikasi: 'LPM Website', modul: 'Struktur', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'struktur.update', nama: 'Edit Struktur', aplikasi: 'LPM Website', modul: 'Struktur', createdAt: '2024-01-01T00:00:00Z' },
  // Users
  { id: 'users.read', nama: 'Lihat Users', aplikasi: 'LPM Website', modul: 'Users', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'users.update', nama: 'Edit Users', aplikasi: 'LPM Website', modul: 'Users', createdAt: '2024-01-01T00:00:00Z' },
  // Dashboard
  { id: 'dashboard.read', nama: 'Lihat Dashboard', aplikasi: 'LPM Website', modul: 'Dashboard', createdAt: '2024-01-01T00:00:00Z' },
];

export async function getPermissions(): Promise<Permission[]> {
  await delay();
  const data = localStorage.getItem('lpm_permissions');
  if (!data) { localStorage.setItem('lpm_permissions', JSON.stringify(DEFAULT_PERMISSIONS)); return DEFAULT_PERMISSIONS; }
  return JSON.parse(data);
}

export async function createPermission(data: Omit<Permission, 'id' | 'createdAt'>): Promise<Permission> {
  await delay();
  const list = await getPermissions();
  const item: Permission = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_permissions', JSON.stringify(list));
  return item;
}

export async function updatePermission(id: string, data: Partial<Permission>): Promise<Permission | undefined> {
  await delay();
  const list = await getPermissions();
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_permissions', JSON.stringify(list));
  return list[idx];
}

export async function deletePermission(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_permissions', JSON.stringify((await getPermissions()).filter(p => p.id !== id)));
}

// ============ AKREDITASI ============
const DEFAULT_AKREDITASI: Akreditasi[] = [
  { id: 'a1', judul: 'Instrumen AMI Auditee', deskripsi: 'Instrumen Audit Mutu Internal untuk Auditee', tipe: 'AMI Auditee', file: '#', linkEksternal: 'https://banpt.or.id', urutan: 1, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'a2', judul: 'Instrumen AMI Auditor', deskripsi: 'Instrumen Audit Mutu Internal untuk Auditor', tipe: 'AMI Auditor', file: '#', urutan: 2, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'a3', judul: 'Instrumen Evaluasi Diri', deskripsi: 'Instrumen evaluasi diri program studi', tipe: 'Evaluasi Diri', file: '#', urutan: 3, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'a4', judul: 'Instrumen Akreditasi Program Studi', deskripsi: 'Instrumen BAN-PT untuk program studi', tipe: 'Program Studi', linkEksternal: 'https://banpt.or.id', urutan: 4, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
];

export async function getAkreditasi(): Promise<Akreditasi[]> {
  await delay();
  const data = localStorage.getItem('lpm_akreditasi');
  if (!data) { localStorage.setItem('lpm_akreditasi', JSON.stringify(DEFAULT_AKREDITASI)); return DEFAULT_AKREDITASI; }
  return JSON.parse(data);
}

export async function createAkreditasi(data: Omit<Akreditasi, 'id' | 'createdAt'>): Promise<Akreditasi> {
  await delay();
  const list = await getAkreditasi();
  const item: Akreditasi = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_akreditasi', JSON.stringify(list));
  return item;
}

export async function updateAkreditasi(id: string, data: Partial<Akreditasi>): Promise<Akreditasi | undefined> {
  await delay();
  const list = await getAkreditasi();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_akreditasi', JSON.stringify(list));
  return list[idx];
}

export async function deleteAkreditasi(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_akreditasi', JSON.stringify((await getAkreditasi()).filter(x => x.id !== id)));
}

// ============ ISO MILESTONE ============
const DEFAULT_ISO: IsoMilestone[] = [
  { id: 'i1', tahun: '2017', judul: 'Sertifikasi ISO 9001:2015 Pertama', deskripsi: 'UIN Raden Fatah memperoleh sertifikat ISO 9001:2015 pertama kali', status: 'completed', urutan: 1, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'i2', tahun: '2019', judul: 'Surveillance Audit Pertama', deskripsi: 'Surveillance audit pertama oleh certifier', status: 'completed', urutan: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'i3', tahun: '2021', judul: 'Re-Certification Audit', deskripsi: 'Berhasil melewati re-certification audit', status: 'completed', urutan: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'i4', tahun: '2024', judul: 'Renewal & Perluasan Cakupan', deskripsi: 'Renewal sertifikat ISO 9001:2015 dengan cakupan lebih luas', status: 'current', urutan: 4, createdAt: '2024-01-01T00:00:00Z' },
];

export async function getIso(): Promise<IsoMilestone[]> {
  await delay();
  const data = localStorage.getItem('lpm_iso');
  if (!data) { localStorage.setItem('lpm_iso', JSON.stringify(DEFAULT_ISO)); return DEFAULT_ISO; }
  return JSON.parse(data);
}

export async function createIso(data: Omit<IsoMilestone, 'id' | 'createdAt'>): Promise<IsoMilestone> {
  await delay();
  const list = await getIso();
  const item: IsoMilestone = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_iso', JSON.stringify(list));
  return item;
}

export async function updateIso(id: string, data: Partial<IsoMilestone>): Promise<IsoMilestone | undefined> {
  await delay();
  const list = await getIso();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_iso', JSON.stringify(list));
  return list[idx];
}

export async function deleteIso(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_iso', JSON.stringify((await getIso()).filter(x => x.id !== id)));
}

// ============ SITUS TERKAIT ============
const DEFAULT_SITUS: SitusItem[] = [
  { id: 's1', nama: 'SIAMI', deskripsi: 'Sistem Akreditasi Mandiri Instrumen', url: 'https://sialim.kemdikbud.go.id', kategori: 'Akreditasi', icon: 'Shield', urutan: 1, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's2', nama: 'BKD Online', deskripsi: 'Pengelolaan data dosen dan karir', url: '#', kategori: 'Lainnya', icon: 'Database', urutan: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's3', nama: 'UIN Raden Fatah', deskripsi: 'Website resmi UIN Raden Fatah Palembang', url: 'https://uin-rfatah.ac.id', kategori: 'Perguruan Tinggi', icon: 'GraduationCap', urutan: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 's4', nama: 'BAN-PT', deskripsi: 'Badan Akreditasi Nasional PT', url: 'https://banpt.or.id', kategori: 'Akreditasi', icon: 'Award', urutan: 4, createdAt: '2024-01-01T00:00:00Z' },
];

export async function getSitus(): Promise<SitusItem[]> {
  await delay();
  const data = localStorage.getItem('lpm_situs');
  if (!data) { localStorage.setItem('lpm_situs', JSON.stringify(DEFAULT_SITUS)); return DEFAULT_SITUS; }
  return JSON.parse(data);
}

export async function createSitus(data: Omit<SitusItem, 'id' | 'createdAt'>): Promise<SitusItem> {
  await delay();
  const list = await getSitus();
  const item: SitusItem = { ...data, id: uid(), createdAt: new Date().toISOString() };
  list.push(item);
  localStorage.setItem('lpm_situs', JSON.stringify(list));
  return item;
}

export async function updateSitus(id: string, data: Partial<SitusItem>): Promise<SitusItem | undefined> {
  await delay();
  const list = await getSitus();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data };
  localStorage.setItem('lpm_situs', JSON.stringify(list));
  return list[idx];
}

export async function deleteSitus(id: string): Promise<void> {
  await delay();
  localStorage.setItem('lpm_situs', JSON.stringify((await getSitus()).filter(x => x.id !== id)));
}

// ============ GPMP ============
const DEFAULT_GPMP: Gpmp = {
  id: 'gpmp1',
  tentang: 'Gugus Pengendalian Mutu Program Studi (GPMP) adalah unit kerja di tingkat program studi yang bertanggung jawab dalam pengendalian dan pemantauan mutu.',
  tugas: [
    { id: 't1', icon: 'ClipboardCheck', judul: 'Pelaksanaan AMI', deskripsi: 'Melaksanakan Audit Mutu Internal secara berkala' },
    { id: 't2', icon: 'Target', judul: 'Pengendalian Mutu', deskripsi: 'Melakukan pengendalian kegiatan penjaminan mutu' },
    { id: 't3', icon: 'BookUser', judul: 'Evaluasi Diri', deskripsi: 'Melakukan evaluasi diri program studi' },
    { id: 't4', icon: 'Users', judul: 'Koordinasi & Pelaporan', deskripsi: 'Mengkoordinasikan kegiatan mutu dengan GPMF' },
  ],
  panduan: '',
  linkPanduan: '#',
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getGpmp(): Promise<Gpmp> {
  await delay();
  const data = localStorage.getItem('lpm_gpmp');
  if (!data) { localStorage.setItem('lpm_gpmp', JSON.stringify(DEFAULT_GPMP)); return DEFAULT_GPMP; }
  return JSON.parse(data);
}

export async function updateGpmp(data: Partial<Gpmp>): Promise<Gpmp> {
  await delay();
  const current = await getGpmp();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_gpmp', JSON.stringify(updated));
  return updated;
}

// ============ GPMF ============
const DEFAULT_GPMF: Gpmf = {
  id: 'gpmf1',
  tentang: 'Gugus Penjaminan Mutu Fakultas (GPMF) merupakan unit fungsional di tingkat fakultas yang bertugas memastikan terlaksananya sistem penjaminan mutu.',
  tugas: [
    { id: 't1', icon: 'ShieldCheck', judul: 'Penjaminan Mutu Fakultas', deskripsi: 'Merumuskan kebijakan penjaminan mutu di tingkat fakultas' },
    { id: 't2', icon: 'Users', judul: 'Koordinasi GPMP', deskripsi: 'Mengkoordinasikan kegiatan GPMP di lingkungan fakultas' },
    { id: 't3', icon: 'Target', judul: 'Monitoring & Evaluasi', deskripsi: 'Melakukan monitoring berkala implementasi SPMI' },
    { id: 't4', icon: 'FileText', judul: 'Pelaporan & Dokumentasi', deskripsi: 'Menyusun laporan hasil penjaminan mutu' },
  ],
  jadwal: [
    { id: 'j1', hari: 'Senin', kegiatan: 'Rapat Koordinasi GPMF', waktu: '09.00 - 11.00 WIB', lokasi: 'Ruang Rapat Dekanat' },
    { id: 'j2', hari: 'Selasa', kegiatan: 'Monitoring kegiatan GPMP', waktu: '13.00 - 15.00 WIB', lokasi: 'Ruang GPMF Lt. 2' },
    { id: 'j3', hari: 'Kamis', kegiatan: 'Evaluasi implementasi SPMI', waktu: '10.00 - 12.00 WIB', lokasi: 'Ruang Rapat Dekanat' },
    { id: 'j4', hari: 'Jumat', kegiatan: 'Diskusi tim GPMF', waktu: '14.00 - 16.00 WIB', lokasi: 'Ruang GPMF Lt. 2' },
  ],
  panduan: '',
  linkPanduan: '#',
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getGpmf(): Promise<Gpmf> {
  await delay();
  const data = localStorage.getItem('lpm_gpmf');
  if (!data) { localStorage.setItem('lpm_gpmf', JSON.stringify(DEFAULT_GPMF)); return DEFAULT_GPMF; }
  return JSON.parse(data);
}

export async function updateGpmf(data: Partial<Gpmf>): Promise<Gpmf> {
  await delay();
  const current = await getGpmf();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_gpmf', JSON.stringify(updated));
  return updated;
}

// ============ SAMBUTAN ============
const DEFAULT_SAMBUTAN: Sambutan = {
  id: 'sambutan1',
  nama: 'Dr. H. Nama Pimpinan, M.Ag.',
  jabatan: 'Ketua LPM UIN Raden Fatah Palembang',
  konten: '"Komitmen terhadap mutu adalah sebuah perjalanan yang tidak pernah berakhir. Di LPM UIN Raden Fatah, kami mendedikasikan diri untuk memastikan bahwa setiap proses akademik berjalan sesuai standar tertinggi nasional dan internasional."',
  foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getSambutan(): Promise<Sambutan> {
  await delay();
  const data = localStorage.getItem('lpm_sambutan');
  if (!data) { localStorage.setItem('lpm_sambutan', JSON.stringify(DEFAULT_SAMBUTAN)); return DEFAULT_SAMBUTAN; }
  return JSON.parse(data);
}

export async function updateSambutan(data: Partial<Sambutan>): Promise<Sambutan> {
  await delay();
  const current = await getSambutan();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_sambutan', JSON.stringify(updated));
  return updated;
}

// ============ VISI MISI ============
const DEFAULT_VISIMISI: VisiMisiData = {
  id: 'visimisi1',
  visi: 'Menjadi Lembaga Penjaminan Mutu yang Unggul dan Bereputasi Internasional',
  misi: [
    { id: 'm1', no: 1, judul: 'Penjaminan Mutu Internal', deskripsi: 'Melaksanakan sistem penjaminan mutu internal secara terencana dan kontinyu dengan mengacu kepada standar nasional dan internasional.' },
    { id: 'm2', no: 2, judul: 'Akreditasi Eksternal', deskripsi: 'Mengkoordinir dan menyiapkan kegiatan penjaminan mutu eksternal melalui akreditasi, baik di tingkat program studi maupun institusi.' },
    { id: 'm3', no: 3, judul: 'Koordinasi Civitas Akademika', deskripsi: 'Mengkoordinir dan mengarahkan semua bagian/civitas akademik UIN Raden Fatah untuk memenuhi seluruh aspek standar mutu.' },
    { id: 'm4', no: 4, judul: 'Sistem Manajemen ISO', deskripsi: 'Mengkoordinir pelaksanaan penjaminan mutu sistem manajemen ISO 9001:2015/IWA2 di seluruh bagian UIN Raden Fatah.' },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getVisiMisi(): Promise<VisiMisiData> {
  await delay();
  const data = localStorage.getItem('lpm_visimisi');
  if (!data) { localStorage.setItem('lpm_visimisi', JSON.stringify(DEFAULT_VISIMISI)); return DEFAULT_VISIMISI; }
  return JSON.parse(data);
}

export async function updateVisiMisi(data: Partial<VisiMisiData>): Promise<VisiMisiData> {
  await delay();
  const current = await getVisiMisi();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_visimisi', JSON.stringify(updated));
  return updated;
}

// ============ STRUKTUR PROFIL ============
const DEFAULT_STRUKTUR: StrukturProfil = {
  id: 'struktur1',
  deskripsi: 'Struktur Organisasi Lembaga Penjaminan Mutu UIN Raden Fatah Palembang disusun untuk memastikan terlaksananya fungsi penjaminan mutu secara optimal.',
  gambar: '',
  filePdf: '',
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getStrukturProfil(): Promise<StrukturProfil> {
  await delay();
  const data = localStorage.getItem('lpm_struktur_profil');
  if (!data) { localStorage.setItem('lpm_struktur_profil', JSON.stringify(DEFAULT_STRUKTUR)); return DEFAULT_STRUKTUR; }
  return JSON.parse(data);
}

export async function updateStrukturProfil(data: Partial<StrukturProfil>): Promise<StrukturProfil> {
  await delay();
  const current = await getStrukturProfil();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_struktur_profil', JSON.stringify(updated));
  return updated;
}

// ============ KONTAK DATA ============
const DEFAULT_KONTAK: KontakData = {
  id: 'kontak1',
  alamat: 'Jl. Pangeran Ratu, 5 Ulu, Kec. Jakabaring Kota Palembang Sumatera Selatan, 30252',
  gedung: 'Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)',
  telepon: '+62 895-2491-8613',
  email: 'lpm_uin@radenfatah.ac.id',
  mapsUrl: '',
  createdAt: '2024-01-01T00:00:00Z',
};

export async function getKontakData(): Promise<KontakData> {
  await delay();
  const data = localStorage.getItem('lpm_kontak');
  if (!data) { localStorage.setItem('lpm_kontak', JSON.stringify(DEFAULT_KONTAK)); return DEFAULT_KONTAK; }
  return JSON.parse(data);
}

export async function updateKontakData(data: Partial<KontakData>): Promise<KontakData> {
  await delay();
  const current = await getKontakData();
  const updated = { ...current, ...data };
  localStorage.setItem('lpm_kontak', JSON.stringify(updated));
  return updated;
}

// ============ MISC ============
export async function getStats() {
  await delay();
  const [berita, galeri, downloads, staf] = await Promise.all([
    getBerita(), getGaleri(), getDownloads(), getStaf()
  ]);
  return {
    totalBerita: berita.length,
    totalGaleri: galeri.length,
    totalDownload: downloads.length,
    totalStaf: staf.length,
    publishedNews: berita.filter(b => b.status === 'published').length,
    draftNews: berita.filter(b => b.status === 'draft').length,
  };
}
