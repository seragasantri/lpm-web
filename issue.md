# Issue Report — Website LPM UIN Raden Fatah Palembang

**URL**: https://lpm.radenfatah.ac.id/
**Tanggal Audit**: 2026-04-15
**Teknologi**: Website statis/dinamis berbasis PHP (?) dengan query string routing

---

## Ringkasan Website

Website resmi **Lembaga Penjaminan Mutu (LPM)** UIN Raden Fatah Palembang. Berfungsi sebagai portal informasi penjaminan mutu akademik, akreditasi, ISO, dan tautan ke sistem terintegrasi UIN Raden Fatah. Dikembangkan oleh **PUSTIPD** (Pusat Teknologi Informasi dan Data). Copyright: PUSTIPD © 2018 - 2026.

---

## Halaman & Fitur yang Ada

### 1. Beranda (Homepage)

| Elemen | Detail |
|--------|--------|
| **URL** | `https://lpm.radenfatah.ac.id/` |
| **Banner Welcome** | Teks "Selamat Datang di Website LPM UIN Raden Fatah Palembang" (berulang) |
| **Galeri Foto Carousel** | 25+ gambar dengan caption kegiatan (Audit ISO, Workshop OBE, AMI, Benchmarking, dll.) |
| **Download File** | 4 file yang bisa diunduh (Instrumen AMI, Formulir Auditor) — tanggal upload 2022 |
| **Jadwal Sholat** | Widget jadwal sholat Palembang (Imsak, Subuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya) |
| **Jajak Pendapat** | Polling "Bagaimana Pendapat Anda tentang Website LPM UIN Raden Fatah ini?" — 4 opsi |
| **Berita Terkini** | 6 artikel berita terbaru (tanggal: Maret–April 2026) |

### 2. Menu Profil

#### 2.1 Profil LPM
- **URL**: `?nmodul=halaman&judul=profil-lpm`
- **Status**: ⚠️ **TIDAK ADA KONTEN** — halaman hanya menampilkan elemen-elemen standar (sidebar, download file, jadwal sholat, footer). Tidak ada konten deskriptif tentang LPM.

#### 2.2 Sambutan Ketua
- **URL**: `?nmodul=halaman&judul=sambutan-ketua-lpm`
- **Konten**: Sambutan dari Ketua LPM dalam format teks Arab dan Indonesia, mengucapkan terima kasih atas peluncuran website.
- **Status**: ✅ Ada konten

#### 2.3 Visi dan Misi
- **URL**: `?nmodul=halaman&judul=visi-dan-misi`
- **Konten**:
  - **Visi**: "Menjadi Lembaga Penjaminan Mutu yang Unggul dan Bereputasi Internasional"
  - **Misi**: 4 poin misi terkait penjaminan mutu internal, akreditasi, dan ISO 9001:2015
- **Status**: ✅ Ada konten

#### 2.4 Struktur Organisasi
- **URL**: `?nmodul=halaman&judul=struktur-organisasi`
- **Konten**: Gambar bagan struktur organisasi (1762915812.jpg)
- **Status**: ✅ Ada konten (gambar)

#### 2.5 Pimpinan dan Staf
- **URL**: `?nmodul=halaman&judul=pimpinan-dan-staff-lembaga-penjaminan-mutu-lpm`
- **Konten**: Daftar pimpinan dan staf LPM dengan foto profil (15+ orang)
- **Status**: ✅ Ada konten

#### 2.6 Kontak
- **URL**: `?nmodul=kontak`
- **Konten**:
  - **Form Kontak** dengan field: Nama Lengkap, No. Identitas (KTP/SIM/Paspor), Email, Alamat, No. Telp/HP, Isi Pesan, Kode Captcha
  - **Peta Lokasi** (embedded map)
  - **Info kontak**: Alamat, telepon, email
- **Status**: ✅ Ada konten (form + peta)

### 3. Menu SPME (Penjaminan Mutu Eksternal)

#### 3.1 Instrumen Akreditasi BAN-PT
- **URL**: `?nmodul=halaman&judul=download-instrumen`
- **Konten**: Teks pengantar + tautan ke banpt.or.id + kumpulan instrumen LAM
- **Status**: ✅ Ada konten

#### 3.2 ISO (International Organization for Standardization)
- **URL**: `?nmodul=halaman&judul=iso`
- **Konten**: ⚠️ **TIDAK ADA KONTEN SPESIFIK** — hanya elemen standar halaman (sidebar, footer, dll.). Tidak ada deskripsi tentang ISO.
- **Status**: ❌ Konten kosong

#### 3.3 Situs Terkait
- **URL**: `?nmodul=tautan`
- **Konten**: Daftar situs tautan terkait (siami, bkd, cdc, dll.)
- **Status**: ✅ Ada konten

### 4. Menu SPMI (Penjaminan Mutu Internal)

#### 4.1 GPMP (Gugus Pengendalian Mutu Prodi)
- **URL**: `?nmodul=halaman&judul=gpmp`
- **Konten**: ⚠️ **TIDAK ADA KONTEN SPESIFIK** — hanya elemen standar. Tidak ada deskripsi GPMP.
- **Status**: ❌ Konten kosong

#### 4.2 GPMF (Gugus Penjaminan Mutu Fakultas)
- **URL**: `?nmodul=halaman&judul=gpmf`
- **Konten**: ⚠️ **TIDAK ADA KONTEN SPESIFIK** — hanya elemen standar. Tidak ada deskripsi GPMF.
- **Status**: ❌ Konten kosong

#### 4.3 SIAMI
- **URL**: Eksternal → `http://siami.radenfatah.ac.id/`
- **Konten**: Sistem Informasi Akreditasi dan Mutu Internal — redirect ke aplikasi terpisah
- **Status**: 🔗 Link eksternal

### 5. Menu BKD Online

#### 5.1 Login BKD
- **URL**: Eksternal → `http://bkd.radenfatah.ac.id`
- **Status**: 🔗 Link eksternal

#### 5.2 Pendaftaran BKD
- **URL**: Eksternal → `http://uinrf.id/BKD-Online-DTNPNS`
- **Status**: 🔗 Link eksternal

### 6. CDC (Career Development Center)
- **URL**: Eksternal → `http://cdc.radenfatah.ac.id`
- **Status**: 🔗 Link eksternal

### 7. Galeri Foto
- **URL**: `?nmodul=fotogaleri`
- **Konten**: Koleksi foto kegiatan (Orientasi 2023, Benchmarking, Rapat Tinajuan Manajemen, Audit ISO, Workshop) dengan tanggal 2018–2023
- **Status**: ✅ Ada konten

### 8. Sertifikat
- **URL**: `?nmodul=halaman&judul=sertifikat-akreditasi`
- **Konten**:
  - Info sertifikat (catatan tentang QR code dan legalisir, data alumni)
  - **Tabel akreditasi 46 prodi**:
    - Akreditasi Unggul: 34 Prodi
    - Akreditasi A: 04 Prodi
    - Akreditasi B: 01 Prodi
    - Akreditasi Baik Sekali: 07 Prodi
- **Status**: ✅ Ada konten

### 9. Peraturan
- **URL**: `?nmodul=halaman&judul=peraturan`
- **Konten**: Daftar regulasi penjaminan mutu:
  - Undang-Undang No.02 Tahun 1989 — Sistem Pendidikan Nasional
  - PP No.19 Tahun 2005 — Standar Nasional Pendidikan
  - Perpres No.8 Tahun 2012 — KKNI
  - Permen No.100 Tahun 2016 — Pendirian/Perubahan PTN
  - Permen No.062 Tahun 2016 — SPMI Dikti
  - Permen No.032 Tahun 2016 — Akreditasi Prodi & PT
  - Permen No.044 Tahun 2015 — SNPT
  - Link ke PerBAN BAN-PT
- **Status**: ✅ Ada konten

### 10. Pengumuman
- **URL**: `?nmodul=pengumuman`
- **Konten**: Daftar pengumuman/pengumuman lainnya
- **Status**: ✅ Ada konten (list link)

---

## Elemen Standar di Semua Halaman

Setiap halaman memiliki elemen sidebar/footer yang sama:

### Download File
4 file yang sama di semua halaman (semuanyaupload tahun 2022 — **outdated**):
1. Link Penyerahan Instrumen yang Telah diisi Auditee (22/07/2022)
2. Formulir AMI Auditor 2022 (21/07/2022)
3. Instrumen AMI Fakultas UPPS 2022 (22/07/2022)
4. Instrumen AMI KPA 2022 (22/07/2022)

### Jadwal Sholat Palembang
Waktu sholat Palembang — **statis/tidak update** (Imsak 04:33, Subuh 04:43, dst.)

### Jajak Pendapat
Poll yang sama di semua halaman.

### Partner Banners
13 link/gambar ke sistem partner UIN Raden Fatah:
1. UIN Raden Fatah Palembang (radenfatah.ac.id)
2. ISO 9001:2015 (gambar)
3. Open Jurnal Sistem (jurnal.radenfatah.ac.id)
4. Aplikasi e-kinerja (e-kinerja.radenfatah.ac.id)
5. eprints Repository (eprints.radenfatah.ac.id)
6. LPSE (lpse.radenfatah.ac.id)
7. Perpustakaan (perpustakaan.radenfatah.ac.id)
8. e-Learning (e-learning.radenfatah.ac.id)
9. Beasiswa Bidik Misi (gambar)
10. Sialim (sialim.radenfatah.ac.id)
11. Email Berbasis Domain (gambar)
12. Senayan Library Information System (gambar)
13. Career Development Center (cdc.radenfatah.ac.id)

### Info Kontak
- Alamat: Jl. Pangeran Ratu, 5 Ulu, Kec. Jakabaring Kota Palembang Sumatera Selatan, 30252
- Gedung Kantor Pusat Administrasi Lantai 4, (Kampus B)
- Telp/WA: +62 895-2491-8613
- Email: lpm_uin@radenfatah.ac.id

### Social Media Links
Facebook, Google+, RSS — semuanya link ke `#` (broken/placeholder)

---

## Issue List

### 🔴 Critical

| # | Issue | Lokasi | Detail |
|---|-------|--------|--------|
| C1 | **Halaman Profil LPM kosong** | `?nmodul=halaman&judul=profil-lpm` | Tidak ada konten deskriptif tentang LPM. Hanya elemen standar halaman. |
| C2 | **Halaman ISO kosong** | `?nmodul=halaman&judul=iso` | Tidak ada konten tentang ISO 9001:2015. |
| C3 | **Halaman GPMP kosong** | `?nmodul=halaman&judul=gpmp` | Tidak ada deskripsi Gugus Pengendalian Mutu Prodi. |
| C4 | **Halaman GPMF kosong** | `?nmodul=halaman&judul=gpmf` | Tidak ada deskripsi Gugus Penjaminan Mutu Fakultas. |
| C5 | **Download file semua tahun 2022 (outdated)** | Semua halaman, section Download File | 4 file yang tersedia masih tanggal 21-22 Juli 2022. Tidak ada file terbaru. |
| C6 | **Jadwal sholat statis, tidak real-time** | Semua halaman, sidebar | Waktu sholat selalu sama, tidak mengikuti tanggal hari ini. |

### 🟡 Medium

| # | Issue | Lokasi | Detail |
|---|-------|--------|--------|
| M1 | **URL menggunakan query string, bukan clean URL** | Semua halaman | Format `?nmodul=halaman&judul=profil-lpm` tidak ramah SEO dan sulit dibaca. Sebaiknya `/profil/profil-lpm`. |
| M2 | **Social media links broken** | Footer semua halaman | Link Facebook, Google+, RSS semua menunjuk ke `#` (placeholder). |
| M3 | **Partner banners ada yang gambar saja, tidak ada link** | Footer | ISO 9001, Beasiswa Bidik Misi, Email Domain, SLiMS hanya gambar tanpa tautan. |
| M4 | **Semua link eksternal menggunakan HTTP** | Footer & nav | `http://` bukan `https://` untuk banyak tautan. Potential mixed content issue. |
| M5 | **Tidak ada halaman berita/artikel detail** | `/artikel/...` → 404 | Link berita di homepage tidak bisa diakses (404). Fitur berita tidak lengkap. |
| M6 | **Struktur Organisasi hanya gambar** | `?nmodul=halaman&judul=struktur-organisasi` | Tidak ada teks alternatif atau deskripsi untuk accessibility. |

### 🟢 Low

| # | Issue | Lokasi | Detail |
|---|-------|--------|--------|
| L1 | **Copyright masih 2018-2026** | Footer | Seharusnya update ke tahun berjalan (2026). |
| L2 | **Welcome text berulang di homepage** | Homepage | "Selamat Datang..." muncul beberapa kali — terlihat like placeholder/content duplikat. |
| L3 | **Tidak ada page-specific title** | Semua halaman | Title homepage "Beranda :: LPM UIN Raden Fatah Palembang" — sub-halaman title tidak jelas/konsisten. |
| L4 | **Galeri foto hanya caption teks** | Galeri Foto | Tidak ada deskripsi detail kegiatan, hanya caption gambar. |
| L5 | **Map embedded tapi tidak ada API** | Halaman Kontak | Peta lokasi — perlu dicek apakah berfungsi atau placeholder. |

---

## Fitur yang Tidak Ada (Opportunities)

| # | Fitur | Potensi |
|---|-------|---------|
| F1 | **Search functionality** | Tidak ada fitur pencarian di website |
| F2 | **SSL/HTTPS tidak konsisten** | Beberapa link masih HTTP |
| F3 | **Dark mode** | Tidak ada opsi tema gelap |
| F4 | **Bahasa Inggris** | Website hanya Bahasa Indonesia |
| F5 | **sitemap.xml** | Tidak ada (404) |
| F6 | **robots.txt** | Tidak ada (404) |
| F7 | **Newsletter/Email subscription** | Tidak ada form langganan berita |
| F8 | **Statistik/Achievements** | Tidak ada halaman pencapaian LPM |
| F9 | **Downloadable annual report** | Tidak ada laporan tahunan yang bisa diunduh |
| F10 | **FAQ page** | Tidak ada halaman pertanyaan umum |

---

## Peta URL / Routing

```
https://lpm.radenfatah.ac.id/
├── ?nmodul=halaman&judul=profil-lpm
├── ?nmodul=halaman&judul=sambutan-ketua-lpm
├── ?nmodul=halaman&judul=visi-dan-misi
├── ?nmodul=halaman&judul=struktur-organisasi
├── ?nmodul=halaman&judul=pimpinan-dan-staff-lembaga-penjaminan-mutu-lpm
├── ?nmodul=kontak
├── ?nmodul=halaman&judul=download-instrumen
├── ?nmodul=halaman&judul=iso                    ← ❌ KOSONG
├── ?nmodul=tautan
├── ?nmodul=halaman&judul=gpmp                  ← ❌ KOSONG
├── ?nmodul=halaman&judul=gpmf                  ← ❌ KOSONG
├── ?nmodul=fotogaleri
├── ?nmodul=halaman&judul=sertifikat-akreditasi
├── ?nmodul=halaman&judul=peraturan
├── ?nmodul=pengumuman
└── EKSTERNAL:
    ├── siami.radenfatah.ac.id
    ├── bkd.radenfatah.ac.id
    ├── cdc.radenfatah.ac.id
    └── (link partner lainnya)
```

---

*Dokumen ini dibuat berdasarkan audit otomatis pada 2026-04-15.*
