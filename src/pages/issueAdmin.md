# Issue Report — Admin Panel LPM UIN Raden Fatah Palembang

**Project**: https://lpm.radenfatah.ac.id/
**Admin Panel**: https://lpm.radenfatah.ac.id/admin
**Tanggal**: 2026-04-15

---

## 1. Ringkasan Admin Panel

Admin panel adalah sistem backend untuk mengelola seluruh konten website LPM UIN Raden Fatah Palembang. Menggunakan React + Vite + TypeScript + Tailwind CSS (sama dengan frontend).

---

## 2. Sistem Role & Permission (Dinamis)

Semua fitur dikendalikan oleh **permission (izin)** yang bisa diatur secara dinamis oleh Super Admin. Tidak ada role tetap seperti "Editor" atau "Viewer" — yang ada hanya daftar permission yang bisa diberikan ke user.

| Komponen | Detail |
|----------|--------|
| **Super Admin** | Role utama, punya semua permission. Tidak bisa dihapus. |
| **User** | User biasa dengan permission yang diatur satu per satu oleh Super Admin. |
| **Permission** | Setiap fitur CRUD punya permission sendiri (bisa create, read, update, delete). Super Admin bisa atur permission user lain. |
| CRUD Permission | Super Admin bisa membuat/menghapus/mengedot permission baru |
| User Management | CRUD user, atur permission per user, reset password, toggle aktif/nonaktif |

**Daftar Permission (bisa ditambah/dikurangi):**
- `berita.create`, `berita.read`, `berita.update`, `berita.delete`
- `galeri.create`, `galeri.read`, `galeri.update`, `galeri.delete`
- `download.create`, `download.read`, `download.update`, `download.delete`
- `halaman.update`
- `staf.create`, `staf.read`, `staf.update`, `staf.delete`
- `sertifikat.create`, `sertifikat.read`, `sertifikat.update`, `sertifikat.delete`
- `peraturan.create`, `peraturan.read`, `peraturan.update`, `peraturan.delete`
- `poll.create`, `poll.read`, `poll.update`, `poll.delete`
- `footer.read`, `footer.update`
- `user.create`, `user.read`, `user.update`, `user.delete`
- `log.read`
- `settings.read`, `settings.update`

---

## 3. Modul & Fitur

### 3.1 Authentication (Login)

| Fitur | Detail |
|-------|--------|
| Halaman Login | Username + Password |
| "Remember Me" | Checkbox untuk keep session |
| Lupa Password | Link reset password via username |
| Logout | Clear session + redirect ke login |
| Session | JWT token |

### 3.2 Dashboard Admin

| Fitur | Detail |
|-------|--------|
| Statistik | Total berita, total galeri, total download, total user |
| Recent Activity | Log aktivitas terbaru (login, edit, create, delete) |
| Quick Actions | Tombol shortcut ke halaman CRUD |
| Notifikasi | Pemberitahuan sertifikat akan expire, konten pending |

### 3.3 Manajemen Berita

| Fitur | Detail |
|-------|--------|
| CRUD Berita | Create, Read, Update, Delete |
| Daftar Berita | Tabel dengan search, filter (kategori, tanggal), pagination |
| Form Berita | Judul, kategori (dropdown), tanggal, gambar (upload), excerpt, konten (rich text editor), status (draft/published) |
| Rich Text Editor | WYSIWYG editor untuk konten berita |
| Upload Gambar | Drag & drop atau browse |
| Preview | Lihat preview berita sebelum publish |
| Status | Draft, Published, Archived |
| SEO Fields | Meta title, slug (auto-generate dari judul) |

### 3.4 Manajemen Galeri Foto

| Fitur | Detail |
|-------|--------|
| CRUD Galeri | Create, Read, Update, Delete |
| Daftar Galeri | Grid view, filter kategori, pagination |
| Upload Multi-gambar | Bulk upload sekaligus |
| Metadata | Judul, kategori, tanggal kegiatan |
| Kategori | Audit, Workshop, Pelatihan, Lainnya |
| Lightbox Preview | Lihat foto di admin |

### 3.5 Manajemen Unduhan (Download File)

| Fitur | Detail |
|-------|--------|
| CRUD File | Create, Read, Update, Delete |
| Upload File | PDF, DOC, XLS, ZIP |
| Metadata | Judul, tipe file |
| Tanggal Upload | Auto timestamp |

### 3.6 Manajemen Halaman Statis

| Fitur | Detail |
|-------|--------|
| Editable Pages | Profil LPM, Sambutan Ketua, Visi Misi, GPMP, GPMF, ISO, Peraturan |
| Rich Text Editor | WYSIWYG untuk setiap halaman |
| Preview | Lihat perubahan sebelum save |

### 3.7 Manajemen Struktur Organisasi

| Fitur | Detail |
|-------|--------|
| Edit Only | 1 halaman edit saja (bukan CRUD list) |
| Form | WYSIWYG editor seperti form berita |
| Upload Gambar | Upload gambar bagan struktur organisasi |
| Deskripsi | Text editor untuk keterangan tambahan |

### 3.8 Manajemen Staf / Pejabat

| Fitur | Detail |
|-------|--------|
| CRUD Staf | Create, Read, Update, Delete |
| Data Staf | Nama, jabatan, foto (upload), program studi, email |
| Urutan Display | Drag & drop atau numbering |
| Grid Preview | Lihat tampilan kartu staf |

### 3.9 Manajemen Sertifikat Akreditasi

| Fitur | Detail |
|-------|--------|
| CRUD Sertifikat | Create, Read, Update, Delete |
| Field Sertifikat | Nama fakultas, nama prodi, jenjang prodi (S1/S2/S3), masa aktif sertifikat (tanggal mulai - tanggal akhir), nilai akreditasi (Unggul/A/B/Baik Sekali) |
| Alarm Masa Berlaku | Notifikasi jika akreditasi akan expire (< 6 bulan) |
| Export | Download daftar sertifikat sebagai PDF/Excel |

### 3.10 Manajemen Peraturan

| Fitur | Detail |
|-------|--------|
| CRUD Peraturan | Create, Read, Update, Delete |
| Kategori | Undang-Undang, PP, Perpres, Permen, Peraturan BAN-PT |
| Data | Kategori, nomor, judul, tahun, tautan eksternal |
| Urutan | Drag & drop untuk atur urutan tampil |

### 3.11 Manajemen Jadwal Sholat

| Fitur | Detail |
|-------|--------|
| Edit Waktu | Input 7 waktu sholat (Imsak, Subuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya) |
| Zona Waktu | WIB (Palembang) |

### 3.12 Manajemen Poll / Jajak Pendapat

| Fitur | Detail |
|-------|--------|
| CRUD Pertanyaan | Buat/edit pertanyaan polling |
| CRUD Opsi | Tambah/hapus opsi jawaban |
| Hasil Poll | Bar chart hasil voting per opsi |
| Reset Vote | Hapus semua vote untuk poll baru |
| Toggle Poll | Aktif/nonaktif poll di homepage |

### 3.13 Manajemen Footer & Partner

| Fitur | Detail |
|-------|--------|
| Edit Info Kontak | Alamat, gedung, telepon, email |
| Edit Tautan Partner | CRUD link partner/sistem terkait |
| Edit Social Media | Facebook, Twitter, Instagram, Youtube links |
| Edit Copyright | Tahun copyright |

### 3.14 User Management

| Fitur | Detail |
|-------|--------|
| CRUD User | Create, Read, Update, Delete, Reset Password |
| Atur Permission | Beri/hapus permission per user secara individual |
| Toggle Aktif | Aktif/nonaktif user |
| Aktivitas User | Log setiap login |

### 3.15 Log Aktivitas

| Fitur | Detail |
|-------|--------|
| Activity Log | Semua aksi CRUD oleh user (siapa, apa, kapan) |
| Login Log | Riwayat login user |
| Filter | Berdasarkan user, tanggal, jenis aksi |

---

## 4. Tech Stack Admin Panel

| Komponen | Pilihan |
|----------|---------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Routing | React Router DOM |
| State Management | Zustand atau React Context |
| HTTP Client | Axios atau fetch |
| Rich Text Editor | Tiptap atau Quill |
| Charts | Recharts |
| Table/Data Grid | TanStack Table |
| Notifications | Sonner |
| Form Validation | React Hook Form + Zod |
| Icons | Lucide React |

---

## 5. Design Admin Panel

| Aspek | Detail |
|-------|--------|
| Layout | Sidebar kiri (collapsible) + Top bar + Main content |
| Warna Sidebar | Sky blue (bg-sky-800), teks putih |
| Warna Content | Putih, background slate-50 |
| Font | Poppins |
| Dark Mode | Toggle dark/light mode |
| Responsive | Desktop-first |

### Struktur Layout Admin:
```
┌─────────────────────────────────────────────────┐
│  Top Bar: Logo | Search | Notifikasi | User     │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Sidebar  │        Main Content Area              │
│          │                                       │
│ - Dashboard                                      │
│ - Berita                                         │
│ - Galeri                                         │
│ - Download                                       │
│ - Halaman Statis                                │
│ - Struktur Organisasi                            │
│ - Staf                                          │
│ - Sertifikat Akreditasi                          │
│ - Peraturan                                      │
│ - Poll                                          │
│ - Footer                                        │
│ - User & Permission                             │
│ - Log Aktivitas                                 │
│                                                 │
└──────────┴──────────────────────────────────────┘
```

---

## 6. Daftar Halaman Admin

```
/admin/login
/admin
/admin/dashboard
/admin/berita
/admin/berita/create
/admin/berita/edit/:id
/admin/galeri
/admin/galeri/create
/admin/galeri/edit/:id
/admin/download
/admin/download/create
/admin/download/edit/:id
/admin/halaman
/admin/halaman/edit/:slug
/admin/struktur-organisasi
/admin/staf
/admin/staf/create
/admin/staf/edit/:id
/admin/sertifikat
/admin/sertifikat/create
/admin/sertifikat/edit/:id
/admin/peraturan
/admin/peraturan/create
/admin/peraturan/edit/:id
/admin/poll
/admin/footer
/admin/users
/admin/users/create
/admin/users/edit/:id
/admin/log
```

---

## 7. Priority Pengerjaan

| Priority | Modul | Effort |
|----------|-------|--------|
| 🔴 P1 | Auth + Dashboard | Rendah |
| 🔴 P1 | Manajemen Berita | Medium |
| 🔴 P1 | Manajemen Galeri | Medium |
| 🟡 P2 | Manajemen Download | Rendah |
| 🟡 P2 | Manajemen Halaman Statis + Struktur Org | Medium |
| 🟡 P2 | Manajemen Staf | Rendah |
| 🟡 P2 | Manajemen Sertifikat Akreditasi | Medium |
| 🟡 P2 | Manajemen Peraturan | Rendah |
| 🟡 P2 | Manajemen Footer | Rendah |
| 🟡 P2 | User & Permission Management | Medium |
| 🟢 P3 | Manajemen Poll | Rendah |
| 🟢 P3 | Manajemen Jadwal Sholat | Rendah |
| 🟢 P3 | Log Aktivitas | Rendah |

---

*Dokumen ini dibuat sebagai rancangan awal. Silakan koreksi, tambahkan, atau hapus modul yang tidak diperlukan.*
