# Issu Tambahan Fitur

## Aturan Umum
- Semua select pakai **TomSelect** (plugin `dropdown_input`)
- Table wajib: **sort**, **search**, **pagination**
- File upload pakai **FileUpload** component (drag & drop)
- RichEditor untuk konten panjang
- Textarea untuk field pendek/teks biasa

---

## 1. Front — Profil (`/profil`)

### Action
Ubah `src/pages/ProfilPage.tsx` agar konten profil diambil dari database (mockData `getHalaman`), bukan hardcoded statis.

### Fitur
- Header: judul halaman dari DB (`page.judul`)
- Konten: rich text content dari DB (`page.konten`)
- Static sections tetap pertahankan (visi, misi, kontak info)

---

## 2. Front — Sambutan Ketua (`/sambutan-ketua`)

### Action
Ubah `src/pages/SambutanPage.tsx` agar konten diambil dari database (`getHalaman` dengan slug `sambutan`).

### Fitur
- Header: judul halaman dari DB
- Quote text: diambil dari `page.konten` atau `page.excerpt`
- Nama & jabatan: dari field baru di halaman statis
- Layout tetap sama (foto, quote, signature)

---

## 3. Admin — Visi Misi

### Action
Ubah `src/admin/pages/halaman/[slug].tsx` agar sesuai dengan field front yang punya **1 visi** dan **multi misi**.

### Fitur Tambah
- Field **Visi**: textarea/text editor untuk isi visi
- Field **Misi**: dynamic list — bisa Tambah/Hapus/Edit misi (array of objects: `{ no, judul, deskripsi }`)
- Di front `VisiMisiPage` ambil data dari `getHalaman('visimisi')` → parse json/rich text

---

## 4. Front — Struktur Organisasi (`/struktur-organisasi`)

### Action
Sesuaikan `src/pages/StrukturPage.tsx` agar gambar/download diambil dari database.

### Fitur
- Field di admin: gambar struktur (file upload), file download PDF (file upload)
- Front: tampilkan gambar, tombol download PDF

---

## 5. Admin — Staf

### Action
Ubah `src/admin/pages/staf/Form.tsx` dan list sesuai field baru.

### Field
1. **Foto** — FileUpload (accept `image/*`)
2. **Nama** — input text
3. **Jabatan** — input text
4. **Sort/Urutan** — input number

### Fitur
- Table: No, Foto (thumbnail), Nama, Jabatan, Urutan, Aksi (Edit, Hapus)
- Form: hanya 4 field di atas

---

## 6. Front — Kontak (`/kontak`)

### Action
Ubah `src/pages/KontakPage.tsx` — hapus form kirim pesan, tampilkan info kontak saja.

### Fitur
- Tampilkan alamat, telepon, email dari `contactInfo` (data/navigation.ts) atau dari menu pengaturan
- **Maps embed** — placeholder atau dari data pengaturan (field `mapsUrl`)
- Tidak ada form kirim pesan
- Layout: Info kontak + maps embed

---

## 7. Admin — Menu SPME (Dropdown)

### Action
Tambah submenu di sidebar Admin dengan dropdown "SPME" yang isinya 3 menu CRUD.

### Submenu Items

#### a. Instrumen Akreditasi BAN-PT (`/admin/spme/akreditasi`)
| Field | Tipe |
|-------|------|
| Judul | input text |
| Deskripsi | textarea |
| Tipe Instrumen ( AMI Auditee / AMI Auditor / Evaluasi Diri / Program Studi ) | TomSelect |
| File/Unduh | FileUpload (accept `.pdf,.doc,.docx`) |
| Link Eksternal | input text (URL) |
| Urutan | input number |
| Status (Aktif/Nonaktif) | toggle |
| Aksi: Tabel List → Create → Edit → Delete |

#### b. ISO (`/admin/spme/iso`)
| Field | Tipe |
|-------|------|
| Tahun/Milestone | input text |
| Judul | input text |
| Deskripsi | textarea |
| Status (completed / current / upcoming) | TomSelect |
| Dokumen ISO (file upload multiple) | FileUpload |
| Link External | input text |
| Urutan | input number |
| Aksi: Tabel List → Create → Edit → Delete |

#### c. Situs Terkait (`/admin/spme/situs`)
| Field | Tipe |
|-------|------|
| Nama Situs | input text |
| Deskripsi | textarea |
| URL | input text (URL) |
| Kategori (Akreditasi / E-Learning / Perpustakaan / dll) | TomSelect |
| Icon (pilihan dari lucide icon) | input text |
| Urutan | input number |
| Aksi: Tabel List → Create → Edit → Delete |

---

## 8. Admin — Menu Profil (Dropdown)

### Action
Tambah submenu di sidebar Admin dengan dropdown "Profil" yang isinya 6 menu CRUD.

### Submenu Items

#### a. Profil LPM (`/admin/profil/lpm`)
| Field | Tipe |
|-------|------|
| Judul | input text |
| Konten | RichEditor |
| Aksi: Form Edit → Save |

#### b. Sambutan Ketua (`/admin/profil/sambutan`)
| Field | Tipe |
|-------|------|
| Nama Ketua | input text |
| Jabatan | input text |
| Konten Sambutan | RichEditor |
| Foto | FileUpload (accept `image/*`) |
| Aksi: Form Edit → Save |

#### c. Visi Misi (`/admin/profil/visimisi`) — overlap dengan no.3
| Field | Tipe |
|-------|------|
| Visi | textarea |
| Misi (dynamic list: judul, deskripsi) | repeat field |
| Aksi: Form Edit → Save |

#### d. Struktur Organisasi (`/admin/profil/struktur`)
| Field | Tipe |
|-------|------|
| Konten/Deskripsi | textarea |
| Gambar Struktur | FileUpload (accept `image/*`) |
| File Download PDF | FileUpload (accept `.pdf`) |
| Aksi: Form Edit → Save |

#### e. Pimpinan & Staf (`/admin/profil/staf`)
Sudah ada di menu Staf, redirect atau alias ke `/admin/staf`

#### f. Kontak (`/admin/profil/kontak`)
| Field | Tipe |
|-------|------|
| Alamat | textarea |
| Gedung | input text |
| Telepon | input text |
| Email | input text |
| Maps Embed URL | input text (URL) |
| Aksi: Form Edit → Save |

---

## 9. Admin — Menu SPMI (Dropdown)

### Action
Tambah submenu di sidebar Admin dengan dropdown "SPMI" yang isinya 2 menu CRUD.

### Submenu Items

#### a. GPMP (`/admin/spmi/gpmp`)
| Field | Tipe |
|-------|------|
| Deskripsi Tentang | textarea |
| Tugas & Fungsi (dynamic list: icon, judul, deskripsi) | repeat field |
| Panduan PDF | FileUpload (accept `.pdf`) |
| Link Panduan Eksternal | input text |
| Aksi: List → Create → Edit → Delete |

#### b. GPMF (`/admin/spmi/gpmf`)
| Field | Tipe |
|-------|------|
| Deskripsi Tentang | textarea |
| Tugas & Fungsi (dynamic list: icon, judul, deskripsi) | repeat field |
| Jadwal Kegiatan (dynamic list: hari, kegiatan, waktu, lokasi) | repeat field |
| Panduan PDF | FileUpload (accept `.pdf`) |
| Link Panduan Eksternal | input text |
| Aksi: List → Create → Edit → Delete |

---

## 10. Admin — Sertifikat

### Action
Ubah format table di `src/admin/pages/sertifikat/List.tsx` — kelompokkan berdasarkan fakultas, rubah kolom.

### Format Table
```
Fakultas Tarbiyah dan Keguruan
├── No | Nama Prodi | Jenjang | Lembaga Akreditasi | Masa Berlaku | Skor | Aksi
├── ... (prodi-prodi di fakultas ini)
Fakultas Ushuluddin dan Studi Islam
├── No | Nama Prodi | Jenjang | Lembaga Akreditasi | Masa Berlaku | Skor | Aksi
├── ...
```

### Kolom
1. **No** — auto number per group
2. **Nama Prodi** — dari `prodi.nama_prodi`
3. **Jenjang** — S1/S2/S3 (badge)
4. **Lembaga Akreditasi** — static "BAN-PT" atau dari prodi
5. **Masa Berlaku** — `{mulaiAktif} s/d {akhirAktif}` (formatted date)
6. **Skor** — Unggul/A/B/Baik Sekali (badge)
7. **Aksi** — Download (link ke file SK), Edit, Hapus

### Fitur Tambah
- Tombol **Download** di aksi — link ke file/sk URL (field baru di Sertifikat type: `fileSk?: string`)
- `fileSk` di type Sertifikat: tambahkan field `fileSk?: string`
- Sort by fakultas → prodi

### Type Update Sertifikat
```ts
interface Sertifikat {
  id: string;
  prodiId: string;
  jenjang: 'S1' | 'S2' | 'S3';
  mulaiAktif: string;
  akhirAktif: string;
  skor: string;
  fileSk?: string; // URL file SK PDF
  createdAt: string;
}
```

---

## Ringkasan Komponen yang Perlu Dibuat

| No | Komponen | Type | Route |
|----|----------|------|-------|
| 1 | SPME — Akreditasi | List + Form | `/admin/spme/akreditasi` |
| 2 | SPME — ISO | List + Form | `/admin/spme/iso` |
| 3 | SPME — Situs | List + Form | `/admin/spme/situs` |
| 4 | Profil — LPM | Form | `/admin/profil/lpm` |
| 5 | Profil — Sambutan | Form | `/admin/profil/sambutan` |
| 6 | Profil — VisiMisi | Form | `/admin/profil/visimisi` |
| 7 | Profil — Struktur | Form | `/admin/profil/struktur` |
| 8 | Profil — Kontak | Form | `/admin/profil/kontak` |
| 9 | SPMI — GPMP | List + Form | `/admin/spmi/gpmp` |
| 10 | SPMI — GPMF | List + Form | `/admin/spmi/gpmf` |
| 11 | Sertifikat Update | List + Form | `/admin/sertifikat` |
| 12 | staf Update | List + Form | `/admin/staf` |

## MockData Functions yang Perlu Ditambah

- `getAkreditasi`, `createAkreditasi`, `updateAkreditasi`, `deleteAkreditasi`
- `getIso`, `createIso`, `updateIso`, `deleteIso`
- `getSitus`, `createSitus`, `updateSitus`, `deleteSitus`
- `getGpmp`, `createGpmp`, `updateGpmp`, `deleteGpmp`
- `getGpmf`, `createGpmf`, `updateGpmf`, `deleteGpmf`
- `getProfil`, `updateProfil` (per slug)

## Types yang Perlu Ditambah

```ts
interface Akreditasi {
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

interface IsoMilestone {
  id: string;
  tahun: string;
  judul: string;
  deskripsi: string;
  status: 'completed' | 'current' | 'upcoming';
  dokumen?: string[];
  linkEksternal?: string;
  urutan: number;
  createdAt: string;
}

interface SitusTer kait {
  id: string;
  nama: string;
  deskripsi: string;
  url: string;
  kategori: string;
  icon: string;
  urutan: number;
  createdAt: string;
}

interface Gpmp {
  id: string;
  tentang: string;
  tugas: { icon: string; judul: string; deskripsi: string }[];
  panduan?: string;
  linkPanduan?: string;
  createdAt: string;
}

interface Gpmf {
  id: string;
  tentang: string;
  tugas: { icon: string; judul: string; deskripsi: string }[];
  jadwal: { hari: string; kegiatan: string; waktu: string; lokasi: string }[];
  panduan?: string;
  linkPanduan?: string;
  createdAt: string;
}

interface Sambutan {
  id: string;
  nama: string;
  jabatan: string;
  konten: string;
  foto?: string;
  createdAt: string;
}

interface KontakData {
  alamat: string;
  gedung: string;
  telepon: string;
  email: string;
  mapsUrl?: string;
}

interface VisiMisiData {
  id: string;
  visi: string;
  misi: { id: string; no: number; judul: string; deskripsi: string }[];
  createdAt: string;
}

interface StrukturProfil {
  id: string;
  deskripsi: string;
  gambar?: string;
  filePdf?: string;
  createdAt: string;
}
```