# Issue Backend - API LPM UIN Raden Fatah

## 1. Informasi Proyek

- **Nama Project**: API Backend Website LPM UIN Raden Fatah Palembang
- **Frontend**: React + TypeScript + Vite (existing, `web-lpm-baru`)
- **Backend**: Laravel 13 (REST API)
- **Database**: MySQL (`api_web_lpm`)
- **Auth**: JWT Token (`tymon/jwt-auth`)
- **RBAC**: `spatie/laravel-permissions`
- **Login**: Username + Password

## 2. Cara Install

```bash
# 1. Buat project Laravel baru
laravel new api-lpm --api

# 2. Masuk ke direktori
cd api-lpm

# 3. Install JWT Auth
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

# 4. Install Spatie Permissions
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate

# 5. Buat database
mysql -u root -p -e "CREATE DATABASE api_web_lpm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 6. Setup .env
cp .env.example .env
# Edit .env:
# DB_DATABASE=api_web_lpm
# DB_USERNAME=root
# DB_PASSWORD=...

# 7. Setup app
php artisan key:generate
php artisan migrate
```

## 3. Struktur Database

### 3.1 Tabel `users` (extends Spatie)

Sudah ada default dari Laravel + Spatie. Tambahan field:

| Field      | Tipe        | Keterangan               |
| ---------- | ----------- | ------------------------ |
| username   | string(255) | UNIQUE, login identifier |
| email      | string(255) | UNIQUE                   |
| password   | string(255) | hashed                   |
| is_active  | boolean     | default: true            |
| last_login | timestamp   | nullable                 |
| created_at | timestamp   |                          |
| updated_at | timestamp   |                          |

> **Catatan**: Kolom-kolom default Laravel (`id`, `remember_token`, `email_verified_at`) tetap dipertahankan.

### 3.2 Tabel `roles` (dari Spatie)

| Field      | Teterangan                   |
| ---------- | ---------------------------- |
| id         | bigint                       |
| name       | string(255) - UNIQUE         |
| guard_name | string(255) - default: 'api' |
| created_at | timestamp                    |
| updated_at | timestamp                    |

### 3.3 Tabel `permissions` (extends Spatie)

| Field      | Tipe        | Keterangan                                   |
| ---------- | ----------- | -------------------------------------------- |
| id         | bigint      | PK                                           |
| name       | string(255) | UNIQUE, format: `{modul}_{action}`           |
| aplikasi   | string(255) | nama aplikasi, default: "LPM Website"          |
| guard_name | string(255) | default: 'api'                               |
| created_at | timestamp   |                                              |
| updated_at | timestamp   |                                              |

> **Format `name`**: `{modul}_{action}` dengan underscore separator.
> Contoh: `berita_create`, `staf_read`, `log_read`.
> **Modul** di-extract dari `name` (bagian sebelum `_`): `berita_create` → modul=`berita`.
> **Action** di-extract dari `name` (bagian setelah `_`): `berita_create` → action=`create`.
> **Display label** di-generate otomatis saat querying: `{action_label} {modul_label}`.
> Contoh: `berita_create` → "Buat Berita", `staf_read` → "Lihat Staf".



### 3.4 Tabel `role_has_permissions` (dari Spatie)

### 3.5 Tabel `model_has_roles` (dari Spatie)

### 3.6 Tabel `model_has_permissions` (dari Spatie)

### 3.7 Tabel `activity_logs`

| Field     | Tipe            | Keterangan                                                      |
| --------- | --------------- | --------------------------------------------------------------- |
| id        | bigint          | PK, auto increment                                              |
| user_id   | bigint unsigned | FK -> users.id                                                  |
| username  | string(255)     | snapshot username saat action                                   |
| action    | string(50)      | CREATE, UPDATE, DELETE, LOGIN, LOGOUT, PUBLISH, DRAFT, ARCHIVED |
| module    | string(100)     | nama modul (Berita, Galeri, User, dll)                          |
| detail    | text            | nullable, detail tambahan                                       |
| timestamp | timestamp       |                                                                 |

### 3.8 Tabel `kategoris`

| Field      | Tipe        | Keterangan           |
| ---------- | ----------- | -------------------- |
| id         | bigint      | PK                   |
| nama       | string(255) | nama kategori        |
| slug       | string(255) | UNIQUE, URL-friendly |
| created_at | timestamp   |                      |
| updated_at | timestamp   |                      |

### 3.9 Tabel `fakultas` (Fakultas)

| Field         | Tipe        | Keterangan                  |
| ------------- | ----------- | --------------------------- |
| id            | bigint      | PK                          |
| kode_fakultas | string(20)  | kode fakultas, contoh: "FT" |
| nama_fakultas | string(255) | nama lengkap fakultas       |
| created_at    | timestamp   |                             |
| updated_at    | timestamp   |                             |

### 3.10 Tabel `prodis` (Program Studi)

| Field       | Tipe            | Keterangan         |
| ----------- | --------------- | ------------------ |
| id          | bigint          | PK                 |
| kode_prodi  | string(20)      | contoh: "PAI"      |
| nama_prodi  | string(255)     | nama lengkap prodi |
| fakultas_id | bigint unsigned | FK -> fakultas.id  |
| created_at  | timestamp       |                    |
| updated_at  | timestamp       |                    |

### 3.11 Tabel `beritas`

| Field       | Tipe                                 | Keterangan           |
| ----------- | ------------------------------------ | -------------------- |
| id          | bigint                               | PK                   |
| judul       | string(255)                          |                      |
| slug        | string(255)                          | UNIQUE               |
| kategori_id | bigint unsigned                      | FK -> kategoris.id   |
| tanggal     | date                                 |                      |
| gambar      | string(500)                          | nullable, URL gambar |
| excerpt     | text                                 | nullable, ringkasan  |
| konten      | longText                             | HTML content         |
| status      | enum('draft','published','archived') | default: 'draft'     |
| meta_title  | string(255)                          | nullable, SEO        |
| author_id   | bigint unsigned                      | FK -> users.id       |
| created_at  | timestamp                            |                      |
| updated_at  | timestamp                            |                      |

### 3.12 Tabel `galeris`

| Field      | Tipe        | Keterangan    |
| ---------- | ----------- | ------------- |
| id         | bigint      | PK            |
| judul      | string(255) |               |
| gambar     | string(500) | URL gambar    |
| kategori   | string(100) | kategori foto |
| tanggal    | date        |               |
| created_at | timestamp   |               |
| updated_at | timestamp   |               |

### 3.13 Tabel `downloads`

| Field      | Tipe        | Keterangan                 |
| ---------- | ----------- | -------------------------- |
| id         | bigint      | PK                         |
| judul      | string(255) |                            |
| tipe       | string(20)  | pdf, doc, xls, zip, link   |
| ukuran     | string(50)  | nullable, contoh: "256 KB" |
| url        | string(500) | URL file atau link         |
| tanggal    | date        |                            |
| created_at | timestamp   |                            |
| updated_at | timestamp   |                            |

### 3.14 Tabel `stafs`

| Field         | Tipe        | Keterangan            |
| ------------- | ----------- | --------------------- |
| id            | bigint      | PK                    |
| nama          | string(255) |                       |
| jabatan       | string(255) |                       |
| foto          | string(500) | nullable, URL foto    |
| program_studi | string(255) | nullable              |
| email         | string(255) | nullable              |
| urutan        | int         | untuk sorting display |
| created_at    | timestamp   |                       |
| updated_at    | timestamp   |                       |

### 3.15 Tabel `sertifikats`

| Field       | Tipe                 | Keterangan                  |
| ----------- | -------------------- | --------------------------- |
| id          | bigint               | PK                          |
| prodi_id    | bigint unsigned      | FK -> prodis.id             |
| jenjang     | enum('S1','S2','S3') |                             |
| mulai_aktif | date                 |                             |
| akhir_aktif | date                 |                             |
| nilai       | string(20)           | nullable, skor/angka        |
| skor        | string(50)           | nullable, Unggul, A, B, dll |
| file_sk     | string(500)          | nullable, URL file SK       |
| created_at  | timestamp            |                             |
| updated_at  | timestamp            |                             |

### 3.16 Tabel `peraturans`

| Field      | Tipe        | Keterangan                                 |
| ---------- | ----------- | ------------------------------------------ |
| id         | bigint      | PK                                         |
| kategori   | string(100) | Undang-Undang, PP, Perpres, Permen, BAN-PT |
| nomor      | string(100) |                                            |
| judul      | string(255) |                                            |
| tahun      | string(10)  | nullable                                   |
| url        | string(500) | nullable, URL dokumen                      |
| urutan     | int         | untuk sorting                              |
| created_at | timestamp   |                                            |
| updated_at | timestamp   |                                            |

### 3.17 Tabel `halamans`

| Field      | Tipe        | Keterangan                 |
| ---------- | ----------- | -------------------------- |
| id         | bigint      | PK                         |
| slug       | string(100) | UNIQUE, identifier halaman |
| judul      | string(255) |                            |
| konten     | longText    | HTML content               |
| created_at | timestamp   |                            |
| updated_at | timestamp   |                            |

**Slugs yang harus ada**:

- `profil` - Profil LPM
- `sambutan` - Sambutan Ketua
- `visimisi` - Visi dan Misi
- `struktur` - Struktur Organisasi
- `gpmp` - Halaman GPMP (diintegrasikan via halaman statis)
- `gpmf` - Halaman GPMF (diintegrasikan via halaman statis)
- `iso` - Halaman ISO (diintegrasikan via halaman statis)
- `peraturan` - Halaman Peraturan (diintegrasikan via halaman statis)

### 3.18 Tabel `visi_misis`

| Field      | Tipe      | Keterangan |
| ---------- | --------- | ---------- |
| id         | bigint    | PK         |
| visi       | text      |            |
| created_at | timestamp |            |
| updated_at | timestamp |            |

### 3.19 Tabel `visi_misi_items` (Misi)

| Field        | Tipe            | Keterangan          |
| ------------ | --------------- | ------------------- |
| id           | bigint          | PK                  |
| visi_misi_id | bigint unsigned | FK -> visi_misis.id |
| no           | int             | nomor misi          |
| judul        | string(255)     | judul misi          |
| deskripsi    | text            | nullable            |
| created_at   | timestamp       |                     |
| updated_at   | timestamp       |                     |

### 3.20 Tabel `sambutans`

| Field      | Tipe        | Keterangan         |
| ---------- | ----------- | ------------------ |
| id         | bigint      | PK                 |
| nama       | string(255) |                    |
| jabatan    | string(255) |                    |
| konten     | text        | nullable           |
| foto       | string(500) | nullable, URL foto |
| created_at | timestamp   |                    |
| updated_at | timestamp   |                    |

### 3.21 Tabel `kontaks`

| Field      | Tipe        | Keterangan                      |
| ---------- | ----------- | ------------------------------- |
| id         | bigint      | PK                              |
| alamat     | text        |                                 |
| gedung     | string(255) | nullable                        |
| telepon    | string(50)  |                                 |
| email      | string(255) |                                 |
| maps_url   | string(500) | nullable, Google Maps embed URL |
| created_at | timestamp   |                                 |
| updated_at | timestamp   |                                 |

### 3.22 Tabel `struktur_profils`

| Field      | Tipe        | Keterangan                    |
| ---------- | ----------- | ----------------------------- |
| id         | bigint      | PK                            |
| deskripsi  | text        | nullable                      |
| gambar     | string(500) | nullable, URL gambar struktur |
| file_pdf   | string(500) | nullable, URL PDF struktur    |
| created_at | timestamp   |                               |
| updated_at | timestamp   |                               |

### 3.23 Tabel `polls`

| Field      | Tipe        | Keterangan    |
| ---------- | ----------- | ------------- |
| id         | bigint      | PK            |
| pertanyaan | string(500) |               |
| is_active  | boolean     | default: true |
| created_at | timestamp   |               |
| updated_at | timestamp   |               |

### 3.24 Tabel `poll_options`

| Field      | Tipe            | Keterangan     |
| ---------- | --------------- | -------------- |
| id         | bigint          | PK             |
| poll_id    | bigint unsigned | FK -> polls.id |
| label      | string(255)     |                |
| votes      | int             | default: 0     |
| created_at | timestamp       |                |
| updated_at | timestamp       |                |

### 3.25 Tabel `footer`

| Field      | Tipe        | Keterangan                              |
| ---------- | ----------- | --------------------------------------- |
| id         | bigint      | PK                                      |
| alamat     | text        |                                         |
| gedung     | string(255) | nullable                                |
| telepon    | string(50)  |                                         |
| email      | string(255) |                                         |
| partners   | json        | array of {nama, url}                    |
| socials    | json        | {facebook, twitter, instagram, youtube} |
| copyright  | string(255) |                                         |
| created_at | timestamp   |                                         |
| updated_at | timestamp   |                                         |

### 3.26 Tabel `akreditasis` (Instrumen SPMI)

| Field          | Tipe                                                              | Keterangan         |
| -------------- | ----------------------------------------------------------------- | ------------------ |
| id             | bigint                                                            | PK                 |
| judul          | string(255)                                                       |                    |
| deskripsi      | text                                                              | nullable           |
| tipe           | enum('AMI Auditee','AMI Auditor','Evaluasi Diri','Program Studi') |                    |
| file           | string(500)                                                       | nullable, URL file |
| link_eksternal | string(500)                                                       | nullable           |
| urutan         | int                                                               |                    |
| is_active      | boolean                                                           | default: true      |
| created_at     | timestamp                                                         |                    |
| updated_at     | timestamp                                                         |                    |

### 3.27 Tabel `iso_milestones`

| Field          | Tipe                                   | Keterangan              |
| -------------- | -------------------------------------- | ----------------------- |
| id             | bigint                                 | PK                      |
| tahun          | string(10)                             |                         |
| judul          | string(255)                            |                         |
| deskripsi      | text                                   | nullable                |
| status         | enum('completed','current','upcoming') |                         |
| dokumen        | json                                   | nullable, array of URLs |
| link_eksternal | string(500)                            | nullable                |
| urutan         | int                                    |                         |
| created_at     | timestamp                              |                         |
| updated_at     | timestamp                              |                         |

### 3.28 Tabel `situs_items`

| Field      | Tipe        | Keterangan                                        |
| ---------- | ----------- | ------------------------------------------------- |
| id         | bigint      | PK                                                |
| nama       | string(255) | nama situs                                        |
| deskripsi  | text        | nullable                                          |
| url        | string(500) |                                                   |
| kategori   | string(100) | Akreditasi, E-Learning, Perpustakaan, PT, Lainnya |
| icon       | string(50)  | nama icon (Lucide icon name)                      |
| urutan     | int         |                                                   |
| created_at | timestamp   |                                                   |
| updated_at | timestamp   |                                                   |

### 3.29 Tabel `gpmps` (Gugus Pengendalian Mutu Prodi)

| Field        | Tipe        | Keterangan        |
| ------------ | ----------- | ----------------- |
| id           | bigint      | PK                |
| tentang      | text        | nullable          |
| panduan      | string(500) | nullable, URL PDF |
| link_panduan | string(500) | nullable          |
| created_at   | timestamp   |                   |
| updated_at   | timestamp   |                   |

### 3.30 Tabel `gpmp_tugas`

| Field      | Tipe            | Keterangan     |
| ---------- | --------------- | -------------- |
| id         | bigint          | PK             |
| gpmp_id    | bigint unsigned | FK -> gpmps.id |
| icon       | string(50)      | nama icon      |
| judul      | string(255)     |                |
| deskripsi  | text            | nullable       |
| created_at | timestamp       |                |
| updated_at | timestamp       |                |

### 3.31 Tabel `gpmfs` (Gugus Penjaminan Mutu fakultas)

| Field        | Tipe        | Keterangan        |
| ------------ | ----------- | ----------------- |
| id           | bigint      | PK                |
| tentang      | text        | nullable          |
| panduan      | string(500) | nullable, URL PDF |
| link_panduan | string(500) | nullable          |
| created_at   | timestamp   |                   |
| updated_at   | timestamp   |                   |

### 3.32 Tabel `gpmf_tugas`

| Field      | Tipe            | Keterangan     |
| ---------- | --------------- | -------------- |
| id         | bigint          | PK             |
| gpmf_id    | bigint unsigned | FK -> gpmfs.id |
| icon       | string(50)      | nama icon      |
| judul      | string(255)     |                |
| deskripsi  | text            | nullable       |
| created_at | timestamp       |                |
| updated_at | timestamp       |                |

### 3.33 Tabel `gpmfjadwals`

| Field      | Tipe            | Keterangan                            |
| ---------- | --------------- | ------------------------------------- |
| id         | bigint          | PK                                    |
| gpmf_id    | bigint unsigned | FK -> gpmfs.id                        |
| hari       | string(20)      | Senin, Selasa, dll                    |
| kegiatan   | string(255)     |                                       |
| waktu      | string(50)      | nullable, contoh: "09.00 - 11.00 WIB" |
| lokasi     | string(255)     | nullable                              |
| created_at | timestamp       |                                       |
| updated_at | timestamp       |                                       |

## 4. Permissions (Guard: 'api')

### 4.1 Permission Strings

Format: `{modul}_{action}` (underscore separator).

```
dashboard_read

berita_create
berita_read
berita_update
berita_delete

galeri_create
galeri_read
galeri_update
galeri_delete

download_create
download_read
download_update
download_delete

halaman_update

staf_create
staf_read
staf_update
staf_delete

sertifikat_create
sertifikat_read
sertifikat_update
sertifikat_delete

peraturan_create
peraturan_read
peraturan_update
peraturan_delete

poll_create
poll_read
poll_update
poll_delete

fakultas_create
fakultas_read
fakultas_update
fakultas_delete

prodi_create
prodi_read
prodi_update
prodi_delete

kategori_create
kategori_read
kategori_update
kategori_delete

user_create
user_read
user_update
user_delete

struktur_read
struktur_update

spme_create
spme_read
spme_update
spme_delete

profil_read
profil_update

spmi_create
spmi_read
spmi_update
spmi_delete

log_read

settings_read
settings_update
```

### 4.2 Display Label Generation

Dari `name` = `{modul}_{action}`, generate label:
- `berita_create` → "Buat Berita"
- `berita_read` → "Lihat Berita"
- `berita_update` → "Edit Berita"
- `berita_delete` → "Hapus Berita"

Mapping action → label:
| Action | Label |
|--------|-------|
| create | Buat |
| read | Lihat |
| update | Edit |
| delete | Hapus |
prodi.delete

kategori.create
kategori.read
kategori.update
kategori.delete

user.create
user.read
user.update
user.delete

struktur.read
struktur.update

spme.create
spme.read
spme.update
spme.delete

profil.read
profil.update

spmi.create
spmi.read
spmi.update
spmi.delete

log.read

settings.read
settings.update
```

### 4.2 Default Roles

1. **Super Admin** - semua permissions
2. **Editor** - berita._, galeri._
3. **Viewer** - dashboard.read, berita.read, galeri.read, download.read, staf.read, sertifikat.read, peraturan.read, spme.\*, profil.read, spmi.read, log.read

## 5. API Endpoints

### 5.1 Authentication

| Method | Endpoint            | Description                             |
| ------ | ------------------- | --------------------------------------- |
| POST   | `/api/auth/login`   | Login (username + password), return JWT |
| POST   | `/api/auth/logout`  | Logout (invalidate token)               |
| GET    | `/api/auth/me`      | Get current user + computed permissions |
| POST   | `/api/auth/refresh` | Refresh JWT token                       |

**Login Request:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@lpm.ac.id",
    "is_active": true,
    "roles": ["Super Admin"],
    "permissions": ["berita.create", "berita.read", ...]
  }
}
```

### 5.2 Dashboard / Stats

| Method | Endpoint               | Permission     | Description                                |
| ------ | ---------------------- | -------------- | ------------------------------------------ |
| GET    | `/api/dashboard/stats` | dashboard.read | Statistik umum (total berita, galeri, dll) |

**Response:**

```json
{
  "total_berita": 6,
  "total_galeri": 6,
  "total_download": 4,
  "total_staf": 6,
  "published_news": 5,
  "draft_news": 1
}
```

### 5.3 Kategori

| Method | Endpoint              | Permission      | Description         |
| ------ | --------------------- | --------------- | ------------------- |
| GET    | `/api/kategoris`      | kategori.read   | List semua kategori |
| POST   | `/api/kategoris`      | kategori.create | Buat kategori baru  |
| GET    | `/api/kategoris/{id}` | kategori.read   | Detail kategori     |
| PUT    | `/api/kategoris/{id}` | kategori.update | Update kategori     |
| DELETE | `/api/kategoris/{id}` | kategori.delete | Hapus kategori      |

**Create/Update Request:**

```json
{
  "nama": "Akreditasi",
  "slug": "akreditasi"
}
```

### 5.4 Berita

| Method | Endpoint            | Permission    | Description                         |
| ------ | ------------------- | ------------- | ----------------------------------- |
| GET    | `/api/beritas`      | berita.read   | List berita (paginated, filterable) |
| POST   | `/api/beritas`      | berita.create | Buat berita baru                    |
| GET    | `/api/beritas/{id}` | berita.read   | Detail berita                       |
| PUT    | `/api/beritas/{id}` | berita.update | Update berita                       |
| DELETE | `/api/beritas/{id}` | berita.delete | Hapus berita                        |

**Create/Update Request:**

```json
{
  "judul": "Judul Berita",
  "slug": "slug-berita",
  "kategori_id": 1,
  "tanggal": "2026-04-13",
  "gambar": "https://...",
  "excerpt": "Ringkasan berita...",
  "konten": "<p>HTML Content...</p>",
  "status": "published",
  "meta_title": "Meta Title untuk SEO"
}
```

**List Query Params**: `?status=draft|published|archived`, `?kategori_id=1`, `?search=keyword`, `?page=1`, `?per_page=10`

### 5.5 Galeri

| Method | Endpoint            | Permission    | Description        |
| ------ | ------------------- | ------------- | ------------------ |
| GET    | `/api/galeris`      | galeri.read   | List galeri        |
| POST   | `/api/galeris`      | galeri.create | Tambah foto galeri |
| GET    | `/api/galeris/{id}` | galeri.read   | Detail galeri      |
| PUT    | `/api/galeris/{id}` | galeri.update | Update galeri      |
| DELETE | `/api/galeris/{id}` | galeri.delete | Hapus galeri       |

**Create/Update Request:**

```json
{
  "judul": "Workshop OBE",
  "gambar": "https://...",
  "kategori": "Workshop",
  "tanggal": "2026-02-10"
}
```

### 5.6 Download

| Method | Endpoint              | Permission      | Description        |
| ------ | --------------------- | --------------- | ------------------ |
| GET    | `/api/downloads`      | download.read   | List file download |
| POST   | `/api/downloads`      | download.create | Tambah file        |
| GET    | `/api/downloads/{id}` | download.read   | Detail             |
| PUT    | `/api/downloads/{id}` | download.update | Update             |
| DELETE | `/api/downloads/{id}` | download.delete | Hapus              |

**Create/Update Request:**

```json
{
  "judul": "Formulir AMI Auditor 2022",
  "tipe": "pdf",
  "ukuran": "256 KB",
  "url": "https://...",
  "tanggal": "2022-07-21"
}
```

### 5.7 Staf

| Method | Endpoint          | Permission  | Description |
| ------ | ----------------- | ----------- | ----------- |
| GET    | `/api/stafs`      | staf.read   | List staf   |
| POST   | `/api/stafs`      | staf.create | Tambah staf |
| GET    | `/api/stafs/{id}` | staf.read   | Detail      |
| PUT    | `/api/stafs/{id}` | staf.update | Update      |
| DELETE | `/api/stafs/{id}` | staf.delete | Hapus       |

**Create/Update Request:**

```json
{
  "nama": "Dr. H. Nama Pimpinan, M.Ag.",
  "jabatan": "Ketua LPM",
  "foto": "https://...",
  "program_studi": "-",
  "email": "ketua@lpm.ac.id",
  "urutan": 1
}
```

### 5.8 Sertifikat Akreditasi

| Method | Endpoint                | Permission        | Description                                      |
| ------ | ----------------------- | ----------------- | ------------------------------------------------ |
| GET    | `/api/sertifikats`      | sertifikat.read   | List sertifikat (dengan relasi prodi & fakultas) |
| POST   | `/api/sertifikats`      | sertifikat.create | Tambah sertifikat                                |
| GET    | `/api/sertifikats/{id}` | sertifikat.read   | Detail                                           |
| PUT    | `/api/sertifikats/{id}` | sertifikat.update | Update                                           |
| DELETE | `/api/sertifikats/{id}` | sertifikat.delete | Hapus                                            |

**Create/Update Request:**

```json
{
  "prodi_id": 1,
  "jenjang": "S1",
  "mulai_aktif": "2024-05-07",
  "akhir_aktif": "2029-05-07",
  "nilai": "351",
  "skor": "Unggul",
  "file_sk": "https://..."
}
```

### 5.9 Peraturan

| Method | Endpoint               | Permission       | Description    |
| ------ | ---------------------- | ---------------- | -------------- |
| GET    | `/api/peraturans`      | peraturan.read   | List peraturan |
| POST   | `/api/peraturans`      | peraturan.create | Tambah         |
| GET    | `/api/peraturans/{id}` | peraturan.read   | Detail         |
| PUT    | `/api/peraturans/{id}` | peraturan.update | Update         |
| DELETE | `/api/peraturans/{id}` | peraturan.delete | Hapus          |

**Create/Update Request:**

```json
{
  "kategori": "Undang-Undang",
  "nomor": "UU No.02/1989",
  "judul": "Tentang Sistem Pendidikan Nasional",
  "tahun": "1989",
  "url": "https://...",
  "urutan": 1
}
```

### 5.10 Halaman Statis

| Method | Endpoint               | Permission     | Description            |
| ------ | ---------------------- | -------------- | ---------------------- |
| GET    | `/api/halamans`        | profil.read    | List semua halaman     |
| GET    | `/api/halamans/{slug}` | profil.read    | Detail halaman by slug |
| PUT    | `/api/halamans/{slug}` | halaman.update | Update halaman by slug |

**Update Request:**

```json
{
  "konten": "<p>HTML Content...</p>"
}
```

### 5.11 Profil - Sambutan

| Method | Endpoint               | Permission    | Description       |
| ------ | ---------------------- | ------------- | ----------------- |
| GET    | `/api/profil/sambutan` | profil.read   | Get data sambutan |
| PUT    | `/api/profil/sambutan` | profil.update | Update            |

**Update Request:**

```json
{
  "nama": "Dr. H. Nama",
  "jabatan": "Ketua LPM",
  "konten": "...",
  "foto": "https://..."
}
```

### 5.12 Profil - Visi Misi

| Method | Endpoint               | Permission    | Description   |
| ------ | ---------------------- | ------------- | ------------- |
| GET    | `/api/profil/visimisi` | profil.read   | Get visi misi |
| PUT    | `/api/profil/visimisi` | profil.update | Update        |

**Update Request:**

```json
{
  "visi": "Menjadi Lembaga Penjaminan Mutu yang Unggul...",
  "misi": [
    { "id": 1, "no": 1, "judul": "Judul Misi 1", "deskripsi": "Deskripsi..." },
    { "id": 2, "no": 2, "judul": "Judul Misi 2", "deskripsi": "Deskripsi..." }
  ]
}
```

### 5.13 Profil - Struktur

| Method | Endpoint               | Permission    | Description       |
| ------ | ---------------------- | ------------- | ----------------- |
| GET    | `/api/profil/struktur` | profil.read   | Get data struktur |
| PUT    | `/api/profil/struktur` | profil.update | Update            |

**Update Request:**

```json
{
  "deskripsi": "Deskripsi struktur...",
  "gambar": "https://...",
  "file_pdf": "https://..."
}
```

### 5.14 Profil - Kontak

| Method | Endpoint             | Permission    | Description     |
| ------ | -------------------- | ------------- | --------------- |
| GET    | `/api/profil/kontak` | profil.read   | Get data kontak |
| PUT    | `/api/profil/kontak` | profil.update | Update          |

**Update Request:**

```json
{
  "alamat": "Jl. Pangeran Ratu...",
  "gedung": "Gedung Kantor Pusat...",
  "telepon": "+62 895-2491-8613",
  "email": "lpm_uin@radenfatah.ac.id",
  "maps_url": "https://www.google.com/maps/embed?..."
}
```

### 5.15 Poll

| Method | Endpoint         | Permission  | Description                          |
| ------ | ---------------- | ----------- | ------------------------------------ |
| GET    | `/api/polls`     | poll.read   | Get poll aktif (public - tanpa auth) |
| PUT    | `/api/poll`      | poll.update | Update poll                          |
| POST   | `/api/poll/vote` | -           | Vote poll (public, tidak perlu auth) |

**Update Request:**

```json
{
  "pertanyaan": "Bagaimana pendapat Anda...",
  "is_active": true,
  "options": [
    { "id": 1, "label": "Sangat Bagus", "votes": 45 },
    { "id": 2, "label": "Cukup Bagus", "votes": 23 }
  ]
}
```

**Vote Request:**

```json
{
  "option_id": 1
}
```

### 5.16 Footer

| Method | Endpoint      | Permission    | Description              |
| ------ | ------------- | ------------- | ------------------------ |
| GET    | `/api/footer` | footer.read   | Get data footer (public) |
| PUT    | `/api/footer` | footer.update | Update footer            |

**Update Request:**

```json
{
  "alamat": "Jl. Pangeran Ratu...",
  "gedung": "Gedung Kantor...",
  "telepon": "+62 895-2491-8613",
  "email": "lpm_uin@radenfatah.ac.id",
  "partners": [
    { "nama": "UIN Raden Fatah", "url": "https://..." },
    { "nama": "SIAMI", "url": "https://..." }
  ],
  "socials": {
    "facebook": "https://...",
    "twitter": "https://...",
    "instagram": "https://...",
    "youtube": "https://..."
  },
  "copyright": "Copyright PUSTIPD © 2018-2026"
}
```

### 5.17 SPME - Akreditasi

| Method | Endpoint                     | Permission  | Description               |
| ------ | ---------------------------- | ----------- | ------------------------- |
| GET    | `/api/spme/akreditasis`      | spme.read   | List instrumen akreditasi |
| POST   | `/api/spme/akreditasis`      | spme.create | Tambah                    |
| GET    | `/api/spme/akreditasis/{id}` | spme.read   | Detail                    |
| PUT    | `/api/spme/akreditasis/{id}` | spme.update | Update                    |
| DELETE | `/api/spme/akreditasis/{id}` | spme.delete | Hapus                     |

**Create/Update Request:**

```json
{
  "judul": "Instrumen AMI Auditee",
  "deskripsi": "Instrumen Audit Mutu Internal...",
  "tipe": "AMI Auditee",
  "file": "https://...",
  "link_eksternal": "https://banpt.or.id",
  "urutan": 1,
  "is_active": true
}
```

### 5.18 SPME - ISO Milestone

| Method | Endpoint              | Permission  | Description        |
| ------ | --------------------- | ----------- | ------------------ |
| GET    | `/api/spme/isos`      | spme.read   | List milestone ISO |
| POST   | `/api/spme/isos`      | spme.create | Tambah             |
| GET    | `/api/spme/isos/{id}` | spme.read   | Detail             |
| PUT    | `/api/spme/isos/{id}` | spme.update | Update             |
| DELETE | `/api/spme/isos/{id}` | spme.delete | Hapus              |

**Create/Update Request:**

```json
{
  "tahun": "2024",
  "judul": "Renewal & Perluasan Cakupan",
  "deskripsi": "Renewal sertifikat ISO 9001:2015...",
  "status": "current",
  "dokumen": ["https://..."],
  "link_eksternal": "https://...",
  "urutan": 4
}
```

### 5.19 SPME - Situs Terkait

| Method | Endpoint               | Permission  | Description |
| ------ | ---------------------- | ----------- | ----------- |
| GET    | `/api/spme/situs`      | spme.read   | List situs  |
| POST   | `/api/spme/situs`      | spme.create | Tambah      |
| GET    | `/api/spme/situs/{id}` | spme.read   | Detail      |
| PUT    | `/api/spme/situs/{id}` | spme.update | Update      |
| DELETE | `/api/spme/situs/{id}` | spme.delete | Hapus       |

**Create/Update Request:**

```json
{
  "nama": "SIAMI",
  "deskripsi": "Sistem Akreditasi Mandiri Instrumen",
  "url": "https://siami.kemdikbud.go.id",
  "kategori": "Akreditasi",
  "icon": "Shield",
  "urutan": 1
}
```

### 5.20 SPMI - GPMP

| Method | Endpoint         | Permission  | Description   |
| ------ | ---------------- | ----------- | ------------- |
| GET    | `/api/spmi/gpmp` | spmi.read   | Get data GPMP |
| PUT    | `/api/spmi/gpmp` | spmi.update | Update GPMP   |

**Update Request:**

```json
{
  "tentang": "GPMP adalah...",
  "tugas": [
    {
      "id": 1,
      "icon": "ClipboardCheck",
      "judul": "Pelaksanaan AMI",
      "deskripsi": "Melaksanakan Audit Mutu Internal..."
    },
    {
      "id": 2,
      "icon": "Target",
      "judul": "Pengendalian Mutu",
      "deskripsi": "Melakukan pengendalian..."
    }
  ],
  "panduan": "https://...",
  "link_panduan": "https://..."
}
```

### 5.21 SPMI - GPMF

| Method | Endpoint         | Permission  | Description   |
| ------ | ---------------- | ----------- | ------------- |
| GET    | `/api/spmi/gpmf` | spmi.read   | Get data GPMF |
| PUT    | `/api/spmi/gpmf` | spmi.update | Update GPMF   |

**Update Request:**

```json
{
  "tentang": "GPMF adalah...",
  "tugas": [
    {
      "id": 1,
      "icon": "ShieldCheck",
      "judul": "Penjaminan Mutu Fakultas",
      "deskripsi": "..."
    }
  ],
  "jadwal": [
    {
      "id": 1,
      "hari": "Senin",
      "kegiatan": "Rapat Koordinasi GPMF",
      "waktu": "09.00 - 11.00 WIB",
      "lokasi": "Ruang Rapat Dekanat"
    }
  ],
  "panduan": "https://...",
  "link_panduan": "https://..."
}
```

### 5.22 fakultas (Fakultas)

| Method | Endpoint             | Permission      | Description   |
| ------ | -------------------- | --------------- | ------------- |
| GET    | `/api/fakultas`      | fakultas.read   | List fakultas |
| POST   | `/api/fakultas`      | fakultas.create | Tambah        |
| GET    | `/api/fakultas/{id}` | fakultas.read   | Detail        |
| PUT    | `/api/fakultas/{id}` | fakultas.update | Update        |
| DELETE | `/api/fakultas/{id}` | fakultas.delete | Hapus         |

### 5.23 Prodi (Program Studi)

| Method | Endpoint           | Permission   | Description |
| ------ | ------------------ | ------------ | ----------- |
| GET    | `/api/prodis`      | prodi.read   | List prodi  |
| POST   | `/api/prodis`      | prodi.create | Tambah      |
| GET    | `/api/prodis/{id}` | prodi.read   | Detail      |
| PUT    | `/api/prodis/{id}` | prodi.update | Update      |
| DELETE | `/api/prodis/{id}` | prodi.delete | Hapus       |

### 5.24 Users (Manajemen User)

| Method | Endpoint                        | Permission  | Description                                   |
| ------ | ------------------------------- | ----------- | --------------------------------------------- |
| GET    | `/api/users`                    | user.read   | List users (tanpa computed permissions field) |
| POST   | `/api/users`                    | user.create | Buat user baru                                |
| GET    | `/api/users/{id}`               | user.read   | Detail user                                   |
| PUT    | `/api/users/{id}`               | user.update | Update user                                   |
| DELETE | `/api/users/{id}`               | user.delete | Hapus user                                    |
| PUT    | `/api/users/{id}/toggle-active` | user.update | Toggle aktif/nonaktif                         |

**Create Request:**

```json
{
  "username": "editor2",
  "email": "editor2@lpm.ac.id",
  "password": "password123",
  "role_ids": [2, 3],
  "is_active": true
}
```

**Update Request:**

```json
{
  "username": "editor2",
  "email": "editor2@lpm.ac.id",
  "role_ids": [2],
  "is_active": true
}
```

**List Response (User):**

```json
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@lpm.ac.id",
      "is_active": true,
      "role_ids": [1],
      "roles": [{ "id": 1, "name": "Super Admin" }],
      "last_login": "2026-04-16T10:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 5.25 Roles

| Method | Endpoint          | Permission  | Description |
| ------ | ----------------- | ----------- | ----------- |
| GET    | `/api/roles`      | user.read   | List roles  |
| POST   | `/api/roles`      | user.create | Buat role   |
| GET    | `/api/roles/{id}` | user.read   | Detail role |
| PUT    | `/api/roles/{id}` | user.update | Update role |
| DELETE | `/api/roles/{id}` | user.delete | Hapus role  |

**Create/Update Request:**

```json
{
  "name": "Editor",
  "permissions": [
    "berita.create",
    "berita.read",
    "berita.update",
    "berita.delete"
  ]
}
```

### 5.26 Permissions (Master)

| Method | Endpoint           | Permission | Description                         |
| ------ | ------------------ | ---------- | ----------------------------------- |
| GET    | `/api/permissions` | user.read  | List semua permission yang tersedia |

### 5.27 Activity Logs

| Method | Endpoint    | Permission | Description           |
| ------ | ----------- | ---------- | --------------------- |
| GET    | `/api/logs` | log.read   | List logs (paginated) |
| DELETE | `/api/logs` | log.read   | Clear all logs        |

**List Query Params**: `?search=username`, `?page=1`, `?per_page=20`

## 6. Public API (Tanpa Auth)

### Frontend Public Pages

| Method | Endpoint                       | Description                                  |
| ------ | ------------------------------ | -------------------------------------------- |
| GET    | `/api/beritas/public`          | List berita published (paginated)            |
| GET    | `/api/beritas/public/{slug}`   | Detail berita by slug                        |
| GET    | `/api/galeris/public`          | List galeri                                  |
| GET    | `/api/downloads/public`        | List downloads                               |
| GET    | `/api/stafs/public`            | List staf (sorted by urutan)                 |
| GET    | `/api/sertifikats/public`      | List sertifikat (with prodi & fakultas data) |
| GET    | `/api/peraturans/public`       | List peraturan                               |
| GET    | `/api/halamans/public/{slug}`  | Halaman statis by slug                       |
| GET    | `/api/profil/visimisi/public`  | Visi Misi                                    |
| GET    | `/api/profil/sambutan/public`  | Sambutan                                     |
| GET    | `/api/profil/struktur/public`  | Struktur                                     |
| GET    | `/api/profil/kontak/public`    | Kontak                                       |
| GET    | `/api/polls/public`            | Poll aktif                                   |
| GET    | `/api/footer/public`           | Footer data                                  |
| GET    | `/api/spme/akreditasis/public` | Instrumen Akreditasi                         |
| GET    | `/api/spme/isos/public`        | ISO Milestones                               |
| GET    | `/api/spme/situs/public`       | Situs Terkait                                |
| GET    | `/api/spmi/gpmp/public`        | GPMP data                                    |
| GET    | `/api/spmi/gpmf/public`        | GPMF data                                    |
| GET    | `/api/kategoris/public`        | List kategori                                |

## 7. File Upload

### 7.1 Strategi

- Backend menerima file upload via multipart/form-data
- File disimpan ke storage (`storage/app/public/`)
- Endpoint untuk upload:

| Method | Endpoint            | Description                                            |
| ------ | ------------------- | ------------------------------------------------------ |
| POST   | `/api/upload/image` | Upload gambar (jpg, png, webp, gif). Max 5MB           |
| POST   | `/api/upload/file`  | Upload file (pdf, doc, docx, xls, xlsx, zip). Max 5MB |

**Request**: `multipart/form-data` dengan field `file`
**Response**:

```json
{
  "url": "https://api.example.com/storage/uploads/filename.jpg",
  "original_name": "image.jpg",
  "size": 102400,
  "mime_type": "image/jpeg"
}
```

### 7.2 Storage Config

- Symlink: `php artisan storage:link`
- Driver: `local` dengan `url` prefix untuk production (atau S3/Cloudinary jika needed)
- Folder structure: `storage/app/public/uploads/{year}/{month}/`

## 8. Response Format

### 8.1 Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Data berhasil disimpan"
}
```

### 8.2 Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "username": ["Username sudah digunakan"],
    "email": ["Format email tidak valid"]
  }
}
```

### 8.3 Paginated Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10
  }
}
```

## 9. Middleware & Security

### 9.1 Middleware Stack

1. `auth:api` - JWT Authentication
2. `permission:{name}` - Spatie Permission check
3. `throttle:60,1` - Rate limiting (60 requests per minute)
4. `activity.log` - Custom middleware untuk logging aktivitas

### 9.2 CORS

Konfigurasi CORS di `config/cors.php` untuk allow frontend origin:

- Development: `http://localhost:5173`
- Production: domain frontend

## 10. Frontend Integration Points

### 10.1 API Base URL

```
VITE_API_URL=http://localhost:8000/api
```

### 10.2 Auth Interceptor (Frontend)

Frontend perlu diupdate dari localStorage-based auth ke JWT-based auth:

**AuthContext changes:**

```typescript
// Replace localStorage session dengan JWT token
const API_BASE = import.meta.env.VITE_API_URL;

// Login - simpan token
const login = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  localStorage.setItem("lpm_token", data.access_token);
  localStorage.setItem("lpm_user", JSON.stringify(data.user));
  setUser(data.user);
};

// Authenticated requests
const apiFetch = async (url: string, options = {}) => {
  const token = localStorage.getItem("lpm_token");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
```

### 10.3 Replace mockData calls

Semua file di `src/lib/mockData.ts` perlu diubah dari localStorage ke API calls.

### 10.4 File Upload Component

Component `FileUpload.tsx` perlu diubah untuk upload ke backend endpoint.

## 11. Activity Logging

Middleware `ActivityLogMiddleware` harus mencatat:

- CREATE → ketika POST berhasil (201)
- UPDATE → ketika PUT berhasil (200/200)
- DELETE → ketika DELETE berhasil (200/200)
- LOGIN → ketika login berhasil
- LOGOUT → ketika logout dipanggil

Format: `action`, `module`, `detail`, `user_id`, `username`, `timestamp`

## 12. Seed Data (Initial Data)

### 12.1 Default Users

1. username: `admin`, password: `admin123`, roles: Super Admin
2. username: `editor`, password: `editor123`, roles: Editor
3. username: `viewer`, password: `viewer123`, roles: Viewer

### 12.2 Default Roles

1. Super Admin → semua permissions
2. Editor → berita._, galeri._
3. Viewer → dashboard.read, berita.read, galeri.read, download.read, staf.read, sertifikat.read, peraturan.read, spme.\*, profil.read, spmi.read, log.read

### 12.3 Default Kategoris

Akreditasi, SPMI, Inovasi Digital, Sertifikasi, ISO, Lainnya

### 12.4 Default fakultas

FT (Tarbiyah dan Keguruan), FU (Ushuluddin dan Studi Islam), FK (Syari'ah), FE (Ekonomi dan Bisnis Islam), FP (Pascasarjana)

### 12.5 Default Prodi

- PAI (Pendidikan Agama Islam) → FT
- PIAI (Pendidikan Islam Anak Usia Dini) → FT
- TQ (Tafsir Hadits) → FU
- HES (Hukum Ekonomi Syariah) → FK
- PEBSI (Perbankan Syariah) → FE

### 12.6 Default Permissions

Kolom `name` dan `aplikasi` saja. Display label di-generate otomatis dari `name`.

| name | aplikasi |
|------|---------|
| dashboard_read | LPM Website |
| berita_create | LPM Website |
| berita_read | LPM Website |
| berita_update | LPM Website |
| berita_delete | LPM Website |
| galeri_create | LPM Website |
| galeri_read | LPM Website |
| galeri_update | LPM Website |
| galeri_delete | LPM Website |
| download_create | LPM Website |
| download_read | LPM Website |
| download_update | LPM Website |
| download_delete | LPM Website |
| halaman_update | LPM Website |
| staf_create | LPM Website |
| staf_read | LPM Website |
| staf_update | LPM Website |
| staf_delete | LPM Website |
| sertifikat_create | LPM Website |
| sertifikat_read | LPM Website |
| sertifikat_update | LPM Website |
| sertifikat_delete | LPM Website |
| peraturan_create | LPM Website |
| peraturan_read | LPM Website |
| peraturan_update | LPM Website |
| peraturan_delete | LPM Website |
| poll_create | LPM Website |
| poll_read | LPM Website |
| poll_update | LPM Website |
| poll_delete | LPM Website |
| fakultas_create | LPM Website |
| fakultas_read | LPM Website |
| fakultas_update | LPM Website |
| fakultas_delete | LPM Website |
| prodi_create | LPM Website |
| prodi_read | LPM Website |
| prodi_update | LPM Website |
| prodi_delete | LPM Website |
| kategori_create | LPM Website |
| kategori_read | LPM Website |
| kategori_update | LPM Website |
| kategori_delete | LPM Website |
| user_create | LPM Website |
| user_read | LPM Website |
| user_update | LPM Website |
| user_delete | LPM Website |
| struktur_read | LPM Website |
| struktur_update | LPM Website |
| spme_create | LPM Website |
| spme_read | LPM Website |
| spme_update | LPM Website |
| spme_delete | LPM Website |
| profil_read | LPM Website |
| profil_update | LPM Website |
| spmi_create | LPM Website |
| spmi_read | LPM Website |
| spmi_update | LPM Website |
| spmi_delete | LPM Website |
| log_read | LPM Website |
| settings_read | LPM Website |
| settings_update | LPM Website |

## 13. Routing Groups

```
/api/auth/*           → auth:api (tanpa throttle khusus)
/api/*                → auth:api, throttle:60,1
/api/public/*         → tanpa auth (public endpoints)
/api/upload/*        → auth:api (protected upload)
```

## 14. API Documentation

Gunakan Laravel API resources untuk konsistensi response format. Contoh:

```php
// app/Http/Resources/BeritaResource.php
class BeritaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'judul' => $this->judul,
            'slug' => $this->slug,
            // ...
        ];
    }
}
```

## 15. Testing Considerations

- Login endpoint: `POST /api/auth/login`
- Permission checks: setiap endpoint harus diverifikasi dengan role yang berbeda
- File upload: test berbagai tipe file dan ukuran
- Activity logging: verifikasi setiap aksi CRUD tercatat di logs
- Pagination: test edge cases (page terakhir, empty results)
